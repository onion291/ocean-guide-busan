"use client";

import { FormEvent, useEffect, useState } from "react";
import { KeyRound, LockKeyhole, Medal, UserRound, X } from "lucide-react";
import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { firebaseAuth } from "./firebase";

type User = { email: string; name: string; password: string; points: number };
const defaultRank = [{ name: "파도지킴이", points: 2480 }, { name: "푸른바다", points: 2210 }, { name: "그린러너", points: 1980 }, { name: "바다친구", points: 1650 }, { name: "해변지킴이", points: 1510 }, { name: "오션러너", points: 1390 }, { name: "파도친구", points: 1240 }, { name: "그린웨이브", points: 1110 }, { name: "부산플로거", points: 980 }, { name: "에코메이트", points: 860 }, { name: "바다새싹", points: 740 }];
const accountsKey = "ocean-guide-accounts";
const readAccounts = (): User[] => { try { const raw = localStorage.getItem(accountsKey); return raw ? JSON.parse(raw) : []; } catch { return []; } };

export default function AccountWidget() {
  const [open, setOpen] = useState<"login" | "signup" | "reset" | "rank" | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState(""); const [message, setMessage] = useState("");
  useEffect(() => onAuthStateChanged(firebaseAuth, (fbUser) => { if (!fbUser) { setUser(null); localStorage.removeItem("ocean-guide-user"); return; } const next = { email: fbUser.email || "", name: fbUser.displayName || fbUser.email?.split("@")[0] || "사용자", password: "", points: 0 }; setUser(next); localStorage.setItem("ocean-guide-user", JSON.stringify(next)); }), []);
  useEffect(() => { if (open === "login") setEmail(localStorage.getItem("ocean-guide-last-email") || ""); }, [open]);
  useEffect(() => {
    const bar = document.querySelector(".account-fab"); if (!bar) return;
    bar.querySelectorAll(".auth-action, .previous-login-btn").forEach((el) => el.remove());
    if (!user) { const last = localStorage.getItem("ocean-guide-last-email"); if (last) { const previous = document.createElement("button"); previous.className = "previous-login-btn"; previous.textContent = "이전 계정으로 로그인"; previous.onclick = () => { setEmail(last); setOpen("login"); }; bar.append(previous); } return; }
    const logout = document.createElement("button"); logout.className = "auth-action logout-btn"; logout.textContent = "로그아웃";
    logout.onclick = async () => { localStorage.setItem("ocean-guide-last-email", user.email); await signOut(firebaseAuth); setOpen(null); window.dispatchEvent(new Event("ocean-auth-changed")); };
    const withdraw = document.createElement("button"); withdraw.className = "auth-action withdraw-btn"; withdraw.textContent = "탈퇴";
    withdraw.onclick = async () => { if (!window.confirm("계정을 탈퇴하시겠습니까? 계정이 영구 삭제됩니다.")) return; if (firebaseAuth.currentUser) await deleteUser(firebaseAuth.currentUser); localStorage.removeItem("ocean-guide-user"); localStorage.removeItem("ocean-guide-last-email"); setOpen(null); window.dispatchEvent(new Event("ocean-auth-changed")); };
    bar.append(logout, withdraw);
  }, [user]);
  useEffect(() => { document.querySelectorAll<HTMLElement>(".ranking-list > div").forEach((row, index) => { row.style.display = index < 10 ? "" : "none"; }); }, [open, user]);
  const close = () => { setOpen(null); setMessage(""); setEmail(""); setPassword(""); setName(""); };
  const submit = async (e: FormEvent) => { e.preventDefault();
    try {
      if (open === "reset") { await sendPasswordResetEmail(firebaseAuth, email.trim()); setMessage(`${email} 주소로 재설정 이메일을 보냈습니다.`); return; }
      if (open === "signup") { const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password); if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() }); localStorage.setItem("ocean-guide-last-email", email.trim()); setMessage("가입이 완료되었습니다."); return; }
      const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password); localStorage.setItem("ocean-guide-last-email", credential.user.email || email.trim()); setMessage("로그인되었습니다.");
    } catch (error) { const code = error instanceof Error ? error.message : "인증에 실패했습니다."; setMessage(code.includes("auth/email-already-in-use") ? "이미 가입된 이메일입니다." : code.includes("auth/invalid-credential") ? "이메일 또는 비밀번호를 확인해주세요." : "인증에 실패했습니다. 입력 내용을 확인해주세요."); }
  };
  return <><div className="account-fab"><button onClick={() => setOpen(user ? "rank" : "login")}><UserRound size={16} /> {user ? user.name : "로그인"}</button><button onClick={() => setOpen("rank")}><Medal size={16} /> 랭킹</button></div>{open && <div className="modal-backdrop" onMouseDown={close}><div className="modal account-modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-head"><h3>{open === "rank" ? "마일리지 랭킹" : open === "signup" ? "회원가입" : open === "reset" ? "비밀번호 찾기" : "로그인"}</h3><button onClick={close}><X size={20} /></button></div>{open === "rank" ? <div className="ranking-list">{(user ? [{ name: user.name, points: user.points }, ...defaultRank] : defaultRank).sort((a, b) => b.points - a.points).map((r, i) => <div key={`${r.name}-${i}`}><b>{i + 1}</b><span><strong>{r.name}</strong><small>부산 바다 활동가</small></span><em>{r.points.toLocaleString()}P</em></div>)}</div> : <form className="account-form" onSubmit={submit}><label>이메일<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></label>{open === "signup" && <label>이름<input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" /></label>}{open !== "reset" && <label>비밀번호<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8자 이상" required /></label>}<button className="submit-btn" type="submit">{open === "signup" ? "가입하기" : open === "reset" ? <><KeyRound size={16} /> 재설정 이메일 보내기</> : <><LockKeyhole size={16} /> 로그인</>}</button>{message && <p className="account-message">{message}</p>}<div className="account-links">{open === "login" && <><button type="button" onClick={() => setOpen("signup")}>회원가입</button><button type="button" onClick={() => setOpen("reset")}>비밀번호 찾기</button></>}{open !== "login" && <button type="button" onClick={() => setOpen("login")}>로그인으로 돌아가기</button>}</div></form>}</div></div>}</>;
}
