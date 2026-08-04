import type { Metadata } from "next";
import OceanGuide from "./OceanGuide";

export const metadata: Metadata = {
  title: "바다길잡이 | 부산 해양 안전 & 관광 스마트 가이드",
  description: "부산의 해변 안전, 친환경 관광, AI 쓰레기 제보를 한곳에서 확인하세요.",
};

export default function Home() {
  return <OceanGuide />;
}
