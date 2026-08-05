"use client";

import { useEffect, useRef, useState } from "react";
import { Car, Coffee, MapPin, Navigation, Waves, X } from "lucide-react";
import "leaflet/dist/leaflet.css";

type Place = { name: string; type: string; lat: number; lon: number; detail: string; popularity?: string; total?: number; left?: number };
const places: Place[] = [
  { name: "해운대해수욕장", type: "해수욕장", lat: 35.1587, lon: 129.1604, detail: "실시간 안전 상태와 수온을 확인하세요." },
  { name: "광안리해수욕장", type: "해수욕장", lat: 35.1532, lon: 129.1187, detail: "광안대교 야경과 해변 산책 명소입니다." },
  { name: "송정해수욕장", type: "해수욕장", lat: 35.1786, lon: 129.1997, detail: "서핑 구역과 해변 안전 정보를 확인하세요." },
  { name: "감천문화마을", type: "관광명소", lat: 35.0975, lon: 129.0106, detail: "부산 대표 문화 관광 명소입니다." },
  { name: "더베이101", type: "관광명소", lat: 35.1568, lon: 129.1512, detail: "마린시티 야경과 식음 공간을 즐겨보세요." },
  { name: "해운대 공영주차장", type: "주차장", lat: 35.1608, lon: 129.1632, detail: "해운대 해변 인근 공영주차장입니다." },
  { name: "광안리 민락주차장", type: "주차장", lat: 35.1539, lon: 129.1232, detail: "민락수변공원과 가까운 주차장입니다." },
  { name: "에코카페 파도", type: "에코스팟", lat: 35.1574, lon: 129.1184, detail: "다회용컵과 플로깅 키트를 이용할 수 있어요." },
  { name: "오륙도 스카이워크", type: "관광명소", lat: 35.1007, lon: 129.1233, detail: "바다 위 유리 전망대와 해안 산책로입니다.", popularity: "오늘 인기 1위" },
  { name: "태종대 유원지", type: "관광명소", lat: 35.0516, lon: 129.0877, detail: "순환열차와 해안 절경을 즐기는 부산 명소입니다.", popularity: "주말 추천" },
  { name: "송도 해상케이블카", type: "관광명소", lat: 35.0762, lon: 129.0188, detail: "송도 바다를 가로지르는 인기 케이블카입니다.", popularity: "대기 18분" },
  { name: "송정 공영주차장", type: "주차장", lat: 35.1802, lon: 129.2018, detail: "송정해수욕장 도보 4분 거리입니다.", total: 180, left: 36 },
  { name: "민락수변공원 주차장", type: "주차장", lat: 35.1535, lon: 129.1262, detail: "수변공원과 회센터 인근 주차장입니다.", total: 260, left: 18 },
  { name: "다대포 해변공원 주차장", type: "주차장", lat: 35.0464, lon: 128.9661, detail: "다대포 일몰 명소와 가까운 넓은 주차장입니다.", total: 320, left: 142 },
  { name: "흰여울문화마을", type: "관광명소", lat: 35.0781, lon: 129.0452, detail: "영도 해안 산책로와 골목 풍경을 즐기는 대표 명소입니다.", popularity: "주말 인기" },
  { name: "오륙도 스카이워크", type: "관광명소", lat: 35.1006, lon: 129.1233, detail: "해안 절벽 위 유리 전망대입니다.", popularity: "오늘 추천" },
  { name: "송정 카페거리", type: "관광명소", lat: 35.1794, lon: 129.1995, detail: "바다 전망 카페가 모여 있는 송정 해변 거리입니다.", popularity: "오션뷰 인기" },
  { name: "해운대 달맞이길", type: "관광명소", lat: 35.1581, lon: 129.1802, detail: "해운대와 송정을 잇는 산책·드라이브 명소입니다.", popularity: "노을 추천" },
  { name: "흰여울비치 카페", type: "에코스팟", lat: 35.0772, lon: 129.0441, detail: "다회용컵을 운영하는 영도 오션뷰 카페입니다." },
  { name: "광안리 해변축제 광장", type: "관광명소", lat: 35.1537, lon: 129.1184, detail: "드론쇼와 계절 행사가 열리는 광안리 중심 구역입니다.", popularity: "이번 주 행사" },
];

const ecoPlaces: Place[] = [
  { name: "해운대 해변 수거함 스테이션", type: "에코 스팟", lat: 35.1582, lon: 129.1601, detail: "해변 입구 분리배출 수거함과 플로깅 용품 대여 위치", popularity: "네이버 지도 검색" },
  { name: "광안리 에코카페 거리", type: "에코 스팟", lat: 35.1538, lon: 129.1194, detail: "다회용컵 사용 매장이 모여 있는 친환경 카페 거리", popularity: "주말 인기" },
  { name: "송정 플로깅 스테이션", type: "에코 스팟", lat: 35.1791, lon: 129.2004, detail: "플로깅 집게와 봉투를 받을 수 있는 해변 안내소", popularity: "방문 추천" },
  { name: "다대포 해변 수거함", type: "에코 스팟", lat: 35.0469, lon: 128.9667, detail: "몰운대 산책로 인근 재활용 수거함", popularity: "네이버 지도 검색" },
  { name: "송도 친환경 관광 안내소", type: "에코 스팟", lat: 35.0768, lon: 129.0182, detail: "해상케이블카 주변 친환경 관광·분리배출 안내", popularity: "방문 추천" },
];

export default function RealMapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [filter, setFilter] = useState("전체");
  const [liveTick, setLiveTick] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setLiveTick((v) => v + 1), 10000); return () => window.clearInterval(timer); }, []);
  useEffect(() => { const refresh = () => setLiveTick((v) => v + 1); window.addEventListener("ocean-report-added", refresh); return () => window.removeEventListener("ocean-report-added", refresh); }, []);
  useEffect(() => { const filters = document.querySelector<HTMLElement>(".leaflet-map-shell")?.parentElement?.querySelector(".filters"); if (!filters || filters.querySelector(".report-filter")) return; const button = document.createElement("button"); button.className = "report-filter"; button.textContent = "제보"; button.onclick = () => setFilter("제보"); filters.appendChild(button); }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const L = await import("leaflet");
      if (!mounted || !mapRef.current || leafletRef.current) return;
      const map = L.map(mapRef.current, { zoomControl: true }).setView([35.155, 129.14], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors" }).addTo(map);
      leafletRef.current = { L, map };
      window.setTimeout(() => map.invalidateSize(), 150);
      renderMarkers(L, map, filter, setSelected, markersRef);
    })();
    return () => { mounted = false; if (leafletRef.current) { leafletRef.current.map.remove(); leafletRef.current = null; } };
  }, []);

  useEffect(() => { if (leafletRef.current) renderMarkers(leafletRef.current.L, leafletRef.current.map, filter, setSelected, markersRef); }, [filter, liveTick]);
  return <main className="content"><section className="section compact"><div className="page-title"><span>BUSAN GEO MAP</span><h1>부산 해양 위치 지도</h1><p>지도를 움직이거나 확대해도 위치 마커가 실제 지리 좌표에 맞춰 함께 이동합니다.</p></div><div className="map-toolbar"><div className="filters scroll">{["전체", "해수욕장", "관광명소", "주차장", "에코스팟"].map((f) => <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>)}</div><a className="locate" href="https://www.openstreetmap.org/#map=13/35.155/129.14" target="_blank" rel="noreferrer"><Navigation size={17} /> 큰 지도</a></div><div className="leaflet-map-shell" ref={mapRef} />{selected && <div className="geo-popup"><button onClick={() => setSelected(null)}><X size={16} /></button><small>{selected.type} · 부산 좌표</small><b>{selected.name}</b><span>{selected.detail}</span><em>위도 {selected.lat} · 경도 {selected.lon}</em></div>}<p className="map-note">지도 데이터 © OpenStreetMap contributors · 마커를 클릭하면 상세정보가 표시됩니다.</p></section></main>;
}

function renderMarkers(L: any, map: any, filter: string, setSelected: (p: Place) => void, markersRef: { current: any[] }) {
  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = [];
  const normalizeType = (value: string) => value.replace(/\\s+/g, "");
  const recentReports: Place[] = (() => { try { return (JSON.parse(localStorage.getItem("ocean-guide-reports") || "[]") as Array<{ type: string; place: string; lat: number; lon: number; time: string; reportKind?: string }>).filter((r) => Date.now() - new Date(r.time).getTime() <= 3 * 60 * 60 * 1000).map((r) => ({ name: `${r.reportKind || "제보"} · ${r.place}`, type: "제보", lat: r.lat, lon: r.lon, detail: `${r.type} 최근 제보 · 접수 후 3시간 이내`, popularity: "최근 3시간 제보" })); } catch { return []; } })();
  [...places, ...ecoPlaces, ...recentReports].filter((p) => filter === "전체" || normalizeType(p.type) === normalizeType(filter) || (filter === "제보" && p.type === "제보")).forEach((place) => {
    const normalizedType = normalizeType(place.type);
    const color = normalizedType === "해수욕장" ? "#0ea5e9" : normalizedType === "관광명소" ? "#8b5cf6" : normalizedType === "주차장" ? "#334155" : normalizedType === "제보" ? "#ef4444" : "#16a34a";
    const icon = L.divIcon({ className: "custom-leaflet-marker", html: `<span style="background:${color}">${normalizedType === "해수욕장" ? "〰" : normalizedType === "주차장" ? "P" : normalizedType === "에코스팟" ? "♻" : normalizedType === "제보" ? "!" : "★"}</span>`, iconSize: [34, 34], iconAnchor: [17, 34] });
    const liveLeft = place.left == null ? undefined : Math.max(0, place.left + Math.round(Math.sin(Date.now() / 30000 + place.lat) * 4));
    const parkingInfo = liveLeft == null ? "" : `<strong class="parking-live">남은 자리 ${liveLeft} / ${place.total}면 · ${liveLeft / (place.total || 1) < .15 ? "혼잡" : "여유"}</strong>`;
    const popup = `<div class="map-detail-popup"><small>${place.type} · 부산 좌표</small><b>${place.name}</b><span>${place.detail}</span>${place.popularity ? `<em class="popular-live">${place.popularity}</em>` : ""}${parkingInfo}<em>위도 ${place.lat} · 경도 ${place.lon}</em></div>`;
    const marker = L.marker([place.lat, place.lon], { icon }).bindPopup(popup, { closeButton: true, offset: [0, -18], className: "ocean-leaflet-popup" }).addTo(map).on("click", () => { setSelected(place); marker.openPopup(); });
    markersRef.current.push(marker);
  });
}
