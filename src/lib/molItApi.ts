// ---------------------------------------------------------------------------
// Optional live-data adapter: MOLIT real-transaction price open API
// (data.go.kr) — SKETCH ONLY, not wired into the demo.
// ---------------------------------------------------------------------------
// The demo ships fully offline on the bundled sample in
// src/data/complexes.ts so judges can test it with zero setup and no key.
//
// To go live later:
//   1. Request a free service key at data.go.kr (may require identity
//      verification — see README "Live data" section).
//   2. Set VITE_MOLIT_SERVICE_KEY in a local .env (never commit it).
//   3. Call fetchTransactions() below, map the rows into PricePoint[],
//      and swap the bundled series for the fetched ones.
//
// API reference (public docs, data.go.kr):
//   GET https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade
//   ?serviceKey=...&LAWD_CD=11680&DEAL_YMD=202610&pageNo=1&numOfRows=100
//   LAWD_CD = 5-digit legal-dong code (e.g. 11680 = Seocho-gu).
//   Response: XML/JSON rows with aptNm, excluUseAr, dealAmount, dealYear,
//   dealMonth, dealDay, floor, etc. dealAmount is in 만원 with commas.
// ---------------------------------------------------------------------------

export interface MolItRow {
  aptNm: string;
  excluUseAr: number;
  dealAmount: number; // 만원
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  floor: number;
}

export interface MolItOptions {
  serviceKey: string;
  lawdCd: string; // e.g. "11680"
  dealYmd: string; // e.g. "202610"
  pageNo?: number;
  numOfRows?: number;
}

export async function fetchTransactions(
  opts: MolItOptions,
): Promise<MolItRow[]> {
  const params = new URLSearchParams({
    serviceKey: opts.serviceKey,
    LAWD_CD: opts.lawdCd,
    DEAL_YMD: opts.dealYmd,
    pageNo: String(opts.pageNo ?? 1),
    numOfRows: String(opts.numOfRows ?? 100),
    _type: 'json',
  });
  const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?${params}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`MOLIT API error: HTTP ${res.status}`);
  }
  const json = await res.json();
  const items =
    json?.response?.body?.items?.item ?? json?.response?.body?.items ?? [];
  const rows = Array.isArray(items) ? items : [items];
  return rows
    .filter((r: Record<string, unknown>) => r.aptNm && r.dealAmount)
    .map((r: Record<string, unknown>) => ({
      aptNm: String(r.aptNm),
      excluUseAr: Number(r.excluUseAr),
      dealAmount: Number(String(r.dealAmount).replace(/,/g, '')),
      dealYear: Number(r.dealYear),
      dealMonth: Number(r.dealMonth),
      dealDay: Number(r.dealDay),
      floor: Number(r.floor),
    }));
}

/** Group fetched rows into a monthly median series (same shape as the bundle). */
export function toMonthlyMedian(
  rows: MolItRow[],
  area: number,
): { month: string; price: number }[] {
  const byMonth = new Map<string, number[]>();
  for (const r of rows) {
    if (Math.abs(r.excluUseAr - area) > 0.5) continue;
    const key = `${r.dealYear}-${String(r.dealMonth).padStart(2, '0')}`;
    const arr = byMonth.get(key) ?? [];
    arr.push(r.dealAmount);
    byMonth.set(key, arr);
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, prices]) => {
      const sorted = [...prices].sort((a, b) => a - b);
      return {
        month,
        price: sorted[Math.floor(sorted.length / 2)],
      };
    });
}
