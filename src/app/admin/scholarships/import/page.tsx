"use client";

import { useState } from "react";

export default function ScholarshipImportPage() {
  const [payload, setPayload] = useState(`[
  {
    "name": "샘플 장학금",
    "provider": "학생지원처",
    "sourceType": "INTERNAL",
    "fundingType": "TUITION",
    "applicationEndDate": "2026-08-01",
    "rawAnnouncementText": "직전 학기 12학점 이상, 평점 3.5 이상"
  }
]`);

  return (
    <main className="min-h-screen bg-base p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">장학금 JSON Import</h1>
        <p className="mt-3 text-secondary">크롤링 결과 JSON을 붙여 넣고 import 흐름을 확인하는 화면입니다.</p>
        <textarea value={payload} onChange={(e) => setPayload(e.target.value)} className="mt-6 min-h-[420px] w-full rounded-panel border border-border bg-surface-alt p-4 font-mono text-sm text-white" />
        <div className="mt-4 flex gap-3">
          <button className="rounded-pill bg-brand px-6 py-3 text-sm font-bold uppercase tracking-[1.6px] text-black">import</button>
          <button className="rounded-pill border border-border px-6 py-3 text-sm font-bold uppercase tracking-[1.6px] text-white">검수 대기</button>
        </div>
      </div>
    </main>
  );
}
