"use client";

import { useState } from "react";
import { Car, Coffee, MapPin, Navigation, Waves, X } from "lucide-react";
import AccountWidget from "./AccountWidget";

const places = [
  { name: "해운대해수욕장", type: "해수욕장", lat: 35.1587, lon: 129.1604, x: 72, y: 28 },
  { name: "광안리해수욕장", type: "해수욕장", lat: 35.1532, lon: 129.1187, x: 57, y: 43 },
  { name: "송정해수욕장", type: "해수욕장", lat: 35.1786, lon: 129.1997, x: 86, y: 18 },
  { name: "감천문화마을", type: "관광명소", lat: 35.0975, lon: 129.0106, x: 15, y: 72 },
  { name: "더베이101", type: "관광명소", lat: 35.1568, lon: 129.1512, x: 68, y: 32 },
  { name: "해운대 공영주차장", type: "주차장", lat: 35.1608, lon: 129.1632, x: 75, y: 25 },
  { name: "광안리 민락주차장", type: "주차장", lat: 35.1539, lon: 129.1232, x: 61, y: 46 },
  { name: "에코카페 파도", type: "에코스팟", lat: 35.1574, lon: 129.1184, x: 56, y: 38 },
];

export default function RealMapView() {
  const [selected, setSelected] = useState<(typeof places)[number] | null>(null);
  const [filter, setFilter] = useState("전체");
  const visible = filter === "전체" ? places : places.filter((p) => p.type === filter);
  return <main className="content"><section className="section compact"><div className="page-title"><span>BUSAN GEO MAP</span><h1>부산 해양 위치 지도</h1><p>실제 부산 지리 위에 해수욕장, 관광명소, 주차장, 에코 스팟을 표시합니다.</p></div><div className="map-toolbar"><div className="filters scroll">{["전체", "해수욕장", "관광명소", "주차장", "에코스팟"].map((f) => <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>)}</div><a className="locate" href="https://www.openstreetmap.org/#map=13/35.155/129.14" target="_blank" rel="noreferrer"><Navigation size={17} /> 큰 지도</a></div><div className="geo-map-shell"><iframe title="부산 실제 지도" src="https://www.openstreetmap.org/export/embed.html?bbox=128.96%2C35.04%2C129.24%2C35.23&layer=mapnik" /><div className="geo-map-overlay">{visible.map((p) => <button key={p.name} className={`geo-pin ${p.type}`} style={{ left: `${p.x}%`, top: `${p.y}%` }} onClick={() => setSelected(p)} aria-label={p.name}><span>{p.type === "해수욕장" ? <Waves size={14} /> : p.type === "주차장" ? <Car size={14} /> : p.type === "에코스팟" ? <Coffee size={14} /> : <MapPin size={14} />}</span></button>)}</div>{selected && <div className="geo-popup"><button onClick={() => setSelected(null)}><X size={16} /></button><small>{selected.type} · 부산 좌표</small><b>{selected.name}</b><span>위도 {selected.lat} · 경도 {selected.lon}</span></div>}</div><p className="map-note">지도 데이터 © OpenStreetMap contributors · 마커는 부산 주요 위치의 데모 좌표입니다.</p></section></main>;
}
