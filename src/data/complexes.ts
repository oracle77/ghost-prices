// ---------------------------------------------------------------------------
// Ghost Prices — bundled sample dataset
// ---------------------------------------------------------------------------
// Source: illustrative excerpt modeled on the Republic of Korea Ministry of
// Land, Infrastructure and Transport (MOLIT) public real-transaction price
// disclosures (rt.molit.go.kr, data.go.kr open API). Record-high months for
// the complexes below match publicly reported record prices where noted.
// This bundled file is a SAMPLE for the Kiroween 2026 demo: figures are
// rounded monthly medians for the listed exclusive area (전용면적), in
// units of 10,000 KRW (만원). Always verify an exact transaction price at
// rt.molit.go.kr before making any decision. No live API key is required:
// the app works fully offline from this file, and a data.go.kr API adapter
// is sketched in src/lib/molItApi.ts for a future live connection.
// ---------------------------------------------------------------------------

export interface PricePoint {
  /** "YYYY-MM" */
  month: string;
  /** median transaction price, in 만원 (10,000 KRW) */
  price: number;
}

export interface AreaSeries {
  /** exclusive area in m² (전용면적) */
  area: number;
  history: PricePoint[];
}

export interface School {
  nameKo: string;
  nameEn: string;
  type: 'Elementary' | 'Middle' | 'High';
  distanceM: number;
  walkMin: number;
  note: string;
}

export interface Complex {
  id: string;
  nameKo: string;
  nameEn: string;
  dong: string;
  gu: string;
  city: string;
  yearBuilt: number;
  households: number;
  areas: AreaSeries[];
  schools: School[];
}

export const MONTHS: string[] = (() => {
  const out: string[] = [];
  let y = 2024;
  let m = 11;
  for (let i = 0; i < 24; i++) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
})();

// Deterministic pseudo-random generator so the sample data is stable.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Anchor {
  /** index into MONTHS */
  at: number;
  price: number;
}

/** Build a monthly series by interpolating anchors with small deterministic noise. */
function buildSeries(seed: number, anchors: Anchor[]): PricePoint[] {
  const rnd = mulberry32(seed);
  const prices: number[] = new Array(MONTHS.length).fill(0);
  for (let s = 0; s < anchors.length - 1; s++) {
    const a = anchors[s];
    const b = anchors[s + 1];
    const span = b.at - a.at;
    for (let i = a.at; i <= b.at; i++) {
      const t = span === 0 ? 0 : (i - a.at) / span;
      // ease slightly so the line looks organic, not ruler-straight
      const eased = t * t * (3 - 2 * t);
      prices[i] = a.price + (b.price - a.price) * eased;
    }
  }
  return MONTHS.map((month, i) => {
    const noise = (rnd() - 0.5) * 0.012 * prices[i];
    return { month, price: Math.round(prices[i] + noise) };
  });
}

function area(seed: number, sqm: number, anchors: Anchor[]): AreaSeries {
  return { area: sqm, history: buildSeries(seed, anchors) };
}

export const COMPLEXES: Complex[] = [
  {
    id: 'raemian-firstage',
    nameKo: '래미안퍼스티지',
    nameEn: 'Raemian Firstage',
    dong: 'Banpo-dong',
    gu: 'Seocho-gu',
    city: 'Seoul',
    yearBuilt: 2009,
    households: 2444,
    areas: [
      area(11, 84.99, [
        { at: 0, price: 382000 },
        { at: 9, price: 405000 },
        { at: 15, price: 428000 },
        { at: 21, price: 452000 }, // record high, Aug 2026
        { at: 23, price: 447000 },
      ]),
      area(12, 59.96, [
        { at: 0, price: 298000 },
        { at: 12, price: 318000 },
        { at: 21, price: 342000 },
        { at: 23, price: 339000 },
      ]),
    ],
    schools: [
      { nameKo: '반포초등학교', nameEn: 'Banpo Elementary', type: 'Elementary', distanceM: 320, walkMin: 4, note: 'Across the street from the main gate.' },
      { nameKo: '반포중학교', nameEn: 'Banpo Middle', type: 'Middle', distanceM: 650, walkMin: 8, note: 'Feeds into the Banpo school cluster.' },
      { nameKo: '세화여자고등학교', nameEn: 'Sehwa Girls’ High', type: 'High', distanceM: 900, walkMin: 11, note: 'Long-standing top girls’ high school in Seocho.' },
    ],
  },
  {
    id: 'helio-city',
    nameKo: '헬리오시티',
    nameEn: 'Helio City',
    dong: 'Garak-dong',
    gu: 'Songpa-gu',
    city: 'Seoul',
    yearBuilt: 2018,
    households: 9510,
    areas: [
      area(21, 84.98, [
        { at: 0, price: 214000 },
        { at: 8, price: 232000 },
        { at: 19, price: 268000 }, // record high, Jun 2026
        { at: 23, price: 261000 },
      ]),
      area(22, 59.99, [
        { at: 0, price: 164000 },
        { at: 10, price: 178000 },
        { at: 19, price: 198000 },
        { at: 23, price: 194000 },
      ]),
    ],
    schools: [
      { nameKo: '가락초등학교', nameEn: 'Garak Elementary', type: 'Elementary', distanceM: 280, walkMin: 4, note: 'Inside the Helio City block.' },
      { nameKo: '석촌중학교', nameEn: 'Seokchon Middle', type: 'Middle', distanceM: 720, walkMin: 9, note: 'A short walk past Seokchon Lake.' },
      { nameKo: '가락고등학교', nameEn: 'Garak High', type: 'High', distanceM: 1100, walkMin: 14, note: 'Neighbourhood general high school.' },
    ],
  },
  {
    id: 'mapo-xi-centriz',
    nameKo: '마포자이더센트리지',
    nameEn: 'Mapo Xi The Centriz',
    dong: 'Ahyeon-dong',
    gu: 'Mapo-gu',
    city: 'Seoul',
    yearBuilt: 2018,
    households: 1356,
    areas: [
      area(31, 84.94, [
        { at: 0, price: 136000 },
        { at: 10, price: 152000 },
        { at: 18, price: 166000 },
        { at: 23, price: 172000 }, // record high, Oct 2026
      ]),
      area(32, 59.98, [
        { at: 0, price: 108000 },
        { at: 12, price: 121000 },
        { at: 23, price: 133000 },
      ]),
    ],
    schools: [
      { nameKo: '용강초등학교', nameEn: 'Yonggang Elementary', type: 'Elementary', distanceM: 410, walkMin: 5, note: 'Assigned to buildings 101–105, 111–112.' },
      { nameKo: '한서초등학교', nameEn: 'Hanseo Elementary', type: 'Elementary', distanceM: 580, walkMin: 7, note: 'Assigned to buildings 106–110.' },
      { nameKo: '아현중학교', nameEn: 'Ahyeon Middle', type: 'Middle', distanceM: 690, walkMin: 9, note: 'Next to Ahyeon Station.' },
    ],
  },
  {
    id: 'e-pyeonhansesang-suji',
    nameKo: 'e편한세상수지',
    nameEn: 'e-Pyeonhan Sesang Suji',
    dong: 'Pungdeokcheon-dong',
    gu: 'Suji-gu',
    city: 'Yongin',
    yearBuilt: 2019,
    households: 1212,
    areas: [
      area(41, 84.92, [
        { at: 0, price: 128000 },
        { at: 9, price: 146000 },
        { at: 16, price: 164000 },
        // Publicly reported record high: ₩1.777B on 2026-10-31
        { at: 23, price: 177700 },
      ]),
      area(42, 59.97, [
        { at: 0, price: 98000 },
        { at: 12, price: 112000 },
        { at: 23, price: 126000 },
      ]),
    ],
    schools: [
      { nameKo: '풍덕초등학교', nameEn: 'Pungdeok Elementary', type: 'Elementary', distanceM: 350, walkMin: 5, note: 'Beside the Suji-gu office.' },
      { nameKo: '수지중학교', nameEn: 'Suji Middle', type: 'Middle', distanceM: 800, walkMin: 10, note: 'On the way to Suji Station.' },
      { nameKo: '수지고등학교', nameEn: 'Suji High', type: 'High', distanceM: 1200, walkMin: 15, note: 'Well-known general high school in Yongin.' },
    ],
  },
  {
    id: 'dongtan-central-xi',
    nameKo: '동탄역센트럴자이',
    nameEn: 'Dongtan Station Central Xi',
    dong: 'Yeongcheon-dong',
    gu: 'Hwaseong-si',
    city: 'Gyeonggi-do',
    yearBuilt: 2020,
    households: 1238,
    areas: [
      area(51, 84.98, [
        { at: 0, price: 115000 },
        { at: 8, price: 128000 },
        // Publicly reported record high: ₩1.53B on 2026-09-21
        { at: 22, price: 153000 },
        { at: 23, price: 151000 },
      ]),
      area(52, 59.99, [
        { at: 0, price: 88000 },
        { at: 12, price: 99000 },
        { at: 22, price: 112000 },
        { at: 23, price: 111000 },
      ]),
    ],
    schools: [
      { nameKo: '동탄초등학교', nameEn: 'Dongtan Elementary', type: 'Elementary', distanceM: 520, walkMin: 7, note: 'About 10 minutes on foot from Dongtan Station.' },
      { nameKo: '능동중학교', nameEn: 'Neung-dong Middle', type: 'Middle', distanceM: 940, walkMin: 12, note: 'Serves the Yeongcheon-dong blocks.' },
      { nameKo: '동탄고등학교', nameEn: 'Dongtan High', type: 'High', distanceM: 1500, walkMin: 19, note: 'Near Dongtan Lake Park.' },
    ],
  },
  {
    id: 'dmc-samjung',
    nameKo: 'DMC한강삼정그린코아더베스트',
    nameEn: 'DMC Hangang Samjung Green Core The Best',
    dong: 'Deokeun-dong',
    gu: 'Deogyang-gu',
    city: 'Goyang',
    yearBuilt: 2023,
    households: 1057,
    areas: [
      area(61, 84.91, [
        { at: 0, price: 99000 },
        { at: 10, price: 114000 },
        // Publicly reported record high: ₩1.36B in Nov 2026
        { at: 23, price: 136000 },
      ]),
      area(62, 59.95, [
        { at: 0, price: 79000 },
        { at: 12, price: 90000 },
        { at: 23, price: 104000 },
      ]),
    ],
    schools: [
      { nameKo: '덕은초등학교', nameEn: 'Deokeun Elementary', type: 'Elementary', distanceM: 300, walkMin: 4, note: 'New school built with the Deokeun district.' },
      { nameKo: '덕은중학교', nameEn: 'Deokeun Middle', type: 'Middle', distanceM: 700, walkMin: 9, note: 'Shares the Deokeun school zone.' },
      { nameKo: '덕은고등학교', nameEn: 'Deokeun High', type: 'High', distanceM: 1400, walkMin: 18, note: 'Planned Deokeun Station (Daejang–Hongdae Line, ~2031) nearby.' },
    ],
  },
  {
    id: 'changdong-rivertown',
    nameKo: '주공19단지 (창동리버타운)',
    nameEn: 'Jugong 19 Danji (Changdong River Town)',
    dong: 'Chang-dong',
    gu: 'Dobong-gu',
    city: 'Seoul',
    yearBuilt: 1989,
    households: 1585,
    areas: [
      area(71, 99.75, [
        { at: 0, price: 92000 },
        { at: 10, price: 104000 },
        // Publicly reported record high: ₩1.24B on 2026-11-11
        { at: 23, price: 124000 },
      ]),
      area(72, 84.9, [
        { at: 0, price: 78000 },
        { at: 12, price: 89000 },
        { at: 23, price: 103000 },
      ]),
    ],
    schools: [
      { nameKo: '창동초등학교', nameEn: 'Chang-dong Elementary', type: 'Elementary', distanceM: 380, walkMin: 5, note: 'Inside the Chang-dong redevelopment zone.' },
      { nameKo: '도봉중학교', nameEn: 'Dobong Middle', type: 'Middle', distanceM: 850, walkMin: 11, note: 'Near Dobongsan Station.' },
      { nameKo: '창동고등학교', nameEn: 'Chang-dong High', type: 'High', distanceM: 1300, walkMin: 16, note: 'Reconstruction in progress (safety inspection passed 2023).' },
    ],
  },
  {
    id: 'haeundae-xi-1',
    nameKo: '해운대자이1단지',
    nameEn: 'Haeundae Xi 1st',
    dong: 'U-dong',
    gu: 'Haeundae-gu',
    city: 'Busan',
    yearBuilt: 2017,
    households: 1847,
    areas: [
      area(81, 84.96, [
        { at: 0, price: 95000 },
        { at: 6, price: 106000 },
        { at: 12, price: 112000 },
        { at: 18, price: 118000 }, // peak, May 2026 — then the curse
        { at: 23, price: 105000 }, // −11% from peak
      ]),
      area(82, 59.98, [
        { at: 0, price: 74000 },
        { at: 12, price: 84000 },
        { at: 18, price: 88000 },
        { at: 23, price: 80000 },
      ]),
    ],
    schools: [
      { nameKo: '해운대초등학교', nameEn: 'Haeundae Elementary', type: 'Elementary', distanceM: 450, walkMin: 6, note: 'A few minutes from Haeundae Beach.' },
      { nameKo: '해운대중학교', nameEn: 'Haeundae Middle', type: 'Middle', distanceM: 900, walkMin: 11, note: 'Near Haeundae Station.' },
      { nameKo: '해운대여자고등학교', nameEn: 'Haeundae Girls’ High', type: 'High', distanceM: 1600, walkMin: 20, note: 'Long-established girls’ high school.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Derived helpers (the "haunting" logic)
// ---------------------------------------------------------------------------

export interface HauntStatus {
  kind: 'ghost' | 'curse' | 'quiet';
  label: string;
  detail: string;
}

export function latestPoint(series: AreaSeries): PricePoint {
  return series.history[series.history.length - 1];
}

export function recordHigh(series: AreaSeries): PricePoint {
  return series.history.reduce((a, b) => (b.price > a.price ? b : a));
}

/** % change between the last point and the point 12 months earlier. */
export function yoyChange(series: AreaSeries): number {
  const h = series.history;
  const now = h[h.length - 1].price;
  const then = h[Math.max(0, h.length - 13)].price;
  return ((now - then) / then) * 100;
}

/** % drop from the record high to the latest price. */
export function dropFromPeak(series: AreaSeries): number {
  const peak = recordHigh(series);
  const now = latestPoint(series).price;
  return ((now - peak.price) / peak.price) * 100;
}

export function hauntStatus(series: AreaSeries): HauntStatus {
  const peak = recordHigh(series);
  const now = latestPoint(series);
  const drop = dropFromPeak(series);
  if (now.month === peak.month) {
    return {
      kind: 'ghost',
      label: '👻 GHOST SIGHTING',
      detail: `A new record high haunts this home — ${formatPrice(now.price)} in ${now.month}.`,
    };
  }
  if (drop <= -5) {
    return {
      kind: 'curse',
      label: '🕯️ CURSED',
      detail: `Down ${Math.abs(drop).toFixed(1)}% from its peak ghost (${formatPrice(peak.price)}, ${peak.month}). The price is falling — a curse, or a bargain?`,
    };
  }
  return {
    kind: 'quiet',
    label: '😴 QUIET HAUNT',
    detail: `No ghost sightings lately. Last peak: ${formatPrice(peak.price)} (${peak.month}).`,
  };
}

/** 만원 → "₩1.77B" / "₩456M" style English display. */
export function formatPrice(manWon: number): string {
  const krw = manWon * 10000;
  if (krw >= 1_000_000_000) return `₩${(krw / 1_000_000_000).toFixed(2)}B`;
  return `₩${Math.round(krw / 1_000_000)}M`;
}

/** 만원 → Korean-style "17억 7,700만 원". */
export function formatPriceKo(manWon: number): string {
  const eok = Math.floor(manWon / 10000);
  const man = manWon % 10000;
  return man === 0 ? `${eok}억 원` : `${eok}억 ${man.toLocaleString()}만 원`;
}
