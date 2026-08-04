"use client";

import { useEffect, useRef, useState } from "react";
import { Car, Coffee, MapPin, Navigation, Waves, X } from "lucide-react";
import "leaflet/dist/leaflet.css";

type Place = { name: string; type: string; lat: number; lon: number; detail: string };
const places: Place[] = [
  { name: "해운대해수욕장", type: "해수욕장", lat: 35.1587, lon: 129.1604, detail: "실시간 안전 상태와 수온을 확인하세요." },
  { name: "광안리해수욕장", type: "해수욕장", lat: 35.1532, lon: 129.1187, detail: "광안대교 야경과 해변 산책 명소입니다." },
  { name: "송정해수욕장", type: "해수욕장", lat: 35.1786, lon: 129.1997, detail: "서핑 구역과 해변 안전 정보를 확인하세요." },
  { name: "감천문화마을", type: "관광명소", lat: 35.0975, lon: 129.0106, detail: "부산 대표 문화 관광 명소입니다." },
  { name: "더베이101", type: "관광명소", lat: 35.1568, lon: 129.1512, detail: "마린시티 야경과 식음 공간을 즐겨보세요." },
  { name: "해운대 공영주차장", type: "주차장", lat: 35.1608, lon: 129.1632, detail: "해운대 해변 인근 공영주차장입니다." },
  { name: "광안리 민락주차장", type: "주차장", lat: 35.1539, lon: 129.1232, detail: "민락수변공원과 가까운 주차장입니다." },
  { name: "에코카페 파도", type: "에코스팟", lat: 35.1574, lon: 129.1184, detail: "다회용컵과 플로깅 키트를 이용할 수 있어요." },
];

export default function RealMapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selected, setSelected] = useState<Place | null>(null);
  const [filter, setFilter] = useState("전체");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const L = await import("leaflet");
      if (!mounted || !mapRef.current || leafletRef.current) return;
      const map = L.map(mapRef.current, { zoomControl: true }).setView([35.155, 129.14], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors" }).addTo(map);
      leafletRef.current = { L, map };
      renderMarkers(L, map, filter, setSelected, markersRef);
    })();
    return () => { mounted = false; if (leafletRef.current) { leafletRef.current.map.remove(); leafletRef.current = null; } };
  }, []);

  useEffect(() => { if (leafletRef.current) renderMarkers(leafletRef.current.L, leafletRef.current.map, filter, setSelected, markersRef); }, [filter]);
  return <main className="content"><section className="section compact"><div className="page-title"><span>BUSAN GEO MAP</span><h1>부산 해양 위치 지도</h1><p>지도를 움직이거나 확대해도 위치 마커가 실제 지리 좌표에 맞춰 함께 이동합니다.</p></div><div className="map-toolbar"><div className="filters scroll">{["전체", "해수욕장", "관광명소", "주차장", "에코스팟"].map((f) => <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>)}</div><a className="locate" href="https://www.openstreetmap.org/#map=13/35.155/129.14" target="_blank" rel="noreferrer"><Navigation size={17} /> 큰 지도</a></div><div className="leaflet-map-shell" ref={mapRef} />{selected && <div className="geo-popup"><button onClick={() => setSelected(null)}><X size={16} /></button><small>{selected.type} · 부산 좌표</small><b>{selected.name}</b><span>{selected.detail}</span><em>위도 {selected.lat} · 경도 {selected.lon}</em></div>}<p className="map-note">지도 데이터 © OpenStreetMap contributors · 마커를 클릭하면 상세정보가 표시됩니다.</p></section></main>;
}

function renderMarkers(L: any, map: any, filter: string, setSelected: (p: Place) => void, markersRef: { current: any[] }) {
  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = [];
  places.filter((p) => filter === "전체" || p.type === filter).forEach((place) => {
    const color = place.type === "해수욕장" ? "#0ea5e9" : place.type === "관광명소" ? "#8b5cf6" : place.type === "주차장" ? "#334155" : "#16a34a";
    const icon = L.divIcon({ className: "custom-leaflet-marker", html: `<span style="background:${color}">${place.type === "해수욕장" ? "〰" : place.type === "주차장" ? "P" : place.type === "에코스팟" ? "♻" : "★"}</span>`, iconSize: [34, 34], iconAnchor: [17, 34] });
    const popup = `<div class="map-detail-popup"><small>${place.type} · 부산 좌표</small><b>${place.name}</b><span>${place.detail}</span><em>위도 ${place.lat} · 경도 ${place.lon}</em></div>`;
    const marker = L.marker([place.lat, place.lon], { icon }).bindPopup(popup, { closeButton: true, offset: [0, -18], className: "ocean-leaflet-popup" }).addTo(map).on("click", () => { setSelected(place); marker.openPopup(); });
    markersRef.current.push(marker);
  });
}
