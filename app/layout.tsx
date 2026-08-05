import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "바다길잡이 | 부산 해양 안전 & 관광 스마트 가이드",
  description: "부산 해변 안전, AI 해양 쓰레기 제보, 친환경 관광과 에코 마일리지를 한곳에서 만나보세요.",
  icons: { icon: "/ocean-guide-favicon.png", shortcut: "/ocean-guide-favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
