import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  COMPLEXES,
  MONTHS,
  dropFromPeak,
  formatPrice,
  formatPriceKo,
  hauntStatus,
  latestPoint,
  recordHigh,
  yoyChange,
  type AreaSeries,
  type Complex,
} from './data/complexes';

const WATCH_KEY = 'ghost-prices:watchlist:v1';

function loadWatchlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem(WATCH_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

function statusStyle(kind: string) {
  if (kind === 'ghost')
    return 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300';
  if (kind === 'curse')
    return 'border-red-400/50 bg-red-400/10 text-red-300';
  return 'border-violet-400/40 bg-violet-400/10 text-violet-300';
}

function GhostTooltip(props: {
  active?: boolean;
  payload?: Array<{ payload: { month: string; price: number } }>;
}) {
  if (!props.active || !props.payload?.length) return null;
  const p = props.payload[0].payload;
  return (
    <div className="rounded-lg border border-violet-400/40 bg-[#120b22] px-3 py-2 text-sm shadow-xl">
      <div className="text-violet-300">{p.month}</div>
      <div className="font-bold text-emerald-300">{formatPrice(p.price)}</div>
      <div className="text-xs text-slate-400">{formatPriceKo(p.price)}</div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(COMPLEXES[0].id);
  const [areaIdx, setAreaIdx] = useState(0);
  const [sliderIdx, setSliderIdx] = useState(0);
  const [showSchools, setShowSchools] = useState(true);
  const [watchlist, setWatchlist] = useState<string[]>(loadWatchlist);
  const [onlyWatched, setOnlyWatched] = useState(false);

  useEffect(() => {
    localStorage.setItem(WATCH_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const selected: Complex =
    COMPLEXES.find((c) => c.id === selectedId) ?? COMPLEXES[0];
  const series: AreaSeries = selected.areas[Math.min(areaIdx, selected.areas.length - 1)];
  const peak = recordHigh(series);
  const latest = latestPoint(series);
  const status = hauntStatus(series);
  const yoy = yoyChange(series);
  const drop = dropFromPeak(series);

  // "Ghost of Prices Past" — the slider summons a past month's price.
  const past = series.history[Math.min(sliderIdx, series.history.length - 1)];
  const ghostDelta = ((latest.price - past.price) / past.price) * 100;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = COMPLEXES;
    if (onlyWatched) list = list.filter((c) => watchlist.includes(c.id));
    if (!q) return list;
    return list.filter((c) =>
      [c.nameEn, c.nameKo, c.dong, c.gu, c.city]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [query, onlyWatched, watchlist]);

  const sightings = COMPLEXES.filter(
    (c) => hauntStatus(c.areas[0]).kind === 'ghost',
  ).length;
  const cursed = COMPLEXES.filter(
    (c) => hauntStatus(c.areas[0]).kind === 'curse',
  ).length;

  const toggleWatch = (id: string) =>
    setWatchlist((w) =>
      w.includes(id) ? w.filter((x) => x !== id) : [...w, id],
    );

  const pickComplex = (id: string) => {
    setSelectedId(id);
    setAreaIdx(0);
    setSliderIdx(0);
    document
      .getElementById('seance')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#0b0714] text-[#e9e4f5]">
      {/* ---------- header ---------- */}
      <header className="border-b border-violet-400/20 bg-[#120b22]/80">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-5xl tracking-wide text-emerald-300 md:text-6xl">
                👻 Ghost Prices
              </h1>
              <p className="mt-2 max-w-xl text-sm text-slate-300 md:text-base">
                Every home has a ghost price. A haunted tracker of Korean
                apartment transaction prices — record highs are{' '}
                <span className="text-emerald-300">ghost sightings</span>,
                sharp drops are{' '}
                <span className="text-red-300">curses</span>. Summon the
                ghost of prices past and see what your home used to cost.
              </p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div>🎃 Kiroween 2026 · Costume Contest</div>
              <div className="mt-1">Nov 2024 – Oct 2026 · 24 months of hauntings</div>
              <div className="mt-1">👀 {watchlist.length} complex(es) on your watchlist</div>
            </div>
          </div>

          {/* search */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 Search a complex, dong, or city — try “Banpo”, “헬리오”, “Busan”…"
              aria-label="Search a complex, dong, or city"
              className="min-w-64 flex-1 rounded-xl border border-violet-400/40 bg-[#1b1030] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-300 focus:outline-none"
            />
            <button
              onClick={() => setOnlyWatched((v) => !v)}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                onlyWatched
                  ? 'border-orange-400 bg-orange-500/20 text-orange-300'
                  : 'border-violet-400/40 bg-[#1b1030] text-slate-300'
              }`}
            >
              {onlyWatched ? '★ Watched only' : '☆ Show watched only'}
            </button>
          </div>

          {/* stats strip */}
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              [`🏠 ${COMPLEXES.length}`, 'haunted complexes'],
              [`👻 ${sightings}`, 'ghost sightings (record highs)'],
              [`🕯️ ${cursed}`, 'cursed (≥5% below peak)'],
              [`🎓 ${COMPLEXES.reduce((n, c) => n + c.schools.length, 0)}`, 'schools in the overlay'],
            ].map(([big, small]) => (
              <div
                key={small}
                className="rounded-xl border border-violet-400/25 bg-[#1b1030] px-4 py-3"
              >
                <div className="text-lg font-bold text-emerald-300">{big}</div>
                <div className="text-xs text-slate-400">{small}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* ---------- complex cards ---------- */}
        <section>
          <h2 className="text-xl font-bold text-orange-300">
            Choose a haunted home
          </h2>
          {filtered.length === 0 && (
            <p className="mt-3 text-sm text-slate-400">
              No ghost answers to that name. Try another complex, dong, or
              city.
            </p>
          )}
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {filtered.map((c) => {
              const s0 = c.areas[0];
              const st = hauntStatus(s0);
              const lp = latestPoint(s0);
              const yy = yoyChange(s0);
              const watched = watchlist.includes(c.id);
              return (
                <article
                  key={c.id}
                  onClick={() => pickComplex(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      pickComplex(c.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${c.nameEn} — latest ${formatPrice(lp.price)}, ${st.label}`}
                  className={`cursor-pointer rounded-2xl border p-4 transition hover:-translate-y-0.5 ${
                    c.id === selectedId
                      ? 'border-emerald-300/70 bg-[#1b1030] shadow-[0_0_30px_rgba(52,211,153,0.15)]'
                      : 'border-violet-400/25 bg-[#120b22]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold">
                        {c.nameEn}{' '}
                        <span className="text-slate-400">· {c.nameKo}</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        {c.dong}, {c.gu}, {c.city} · built {c.yearBuilt} ·{' '}
                        {c.households.toLocaleString()} households
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatch(c.id);
                      }}
                      title={watched ? 'Remove from watchlist' : 'Add to watchlist'}
                      aria-label={
                        watched
                          ? `Remove ${c.nameEn} from watchlist`
                          : `Add ${c.nameEn} to watchlist`
                      }
                      aria-pressed={watched}
                      className="rounded-lg border border-violet-400/40 px-2 py-1 text-sm"
                    >
                      {watched ? '★' : '☆'}
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <div className="text-2xl font-extrabold text-emerald-300">
                        {formatPrice(lp.price)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {s0.area}㎡ · {lp.month} · {formatPriceKo(lp.price)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`rounded-full border px-2 py-1 text-xs font-semibold ${statusStyle(st.kind)}`}
                      >
                        {st.label}
                      </span>
                      <div
                        className={`mt-1 text-sm font-semibold ${yy >= 0 ? 'text-emerald-300' : 'text-red-300'}`}
                      >
                        {yy >= 0 ? '▲' : '▼'} {Math.abs(yy).toFixed(1)}% YoY
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ---------- séance: detail ---------- */}
        <section id="seance" className="mt-8 scroll-mt-4">
          <h2 className="font-display text-3xl text-emerald-300">
            🔮 The Séance — {selected.nameEn}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {selected.nameKo} · {selected.dong}, {selected.gu},{' '}
            {selected.city} · built {selected.yearBuilt}
          </p>

          {/* haunt banner */}
          <div
            className={`mt-4 rounded-2xl border p-4 ${statusStyle(status.kind)}`}
          >
            <div className="font-bold">{status.label}</div>
            <p className="mt-1 text-sm">{status.detail}</p>
            <p className="mt-1 text-xs opacity-80">
              Peak ghost: {formatPrice(peak.price)} ({peak.month}) · now{' '}
              {formatPrice(latest.price)} ({drop.toFixed(1)}% from peak) ·
              YoY {yoy >= 0 ? '+' : ''}
              {yoy.toFixed(1)}%
            </p>
          </div>

          {/* area tabs */}
          <div className="mt-4 flex gap-2">
            {selected.areas.map((a, i) => (
              <button
                key={a.area}
                onClick={() => {
                  setAreaIdx(i);
                  setSliderIdx(0);
                }}
                aria-pressed={i === areaIdx}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                  i === areaIdx
                    ? 'border-emerald-300 bg-emerald-400/15 text-emerald-300'
                    : 'border-violet-400/40 bg-[#1b1030] text-slate-300'
                }`}
              >
                {a.area}㎡
              </button>
            ))}
            <span className="self-center text-xs text-slate-500">
              exclusive area (전용면적) · monthly median transaction price
            </span>
          </div>

          {/* chart */}
          <div className="mt-4 rounded-2xl border border-violet-400/25 bg-[#120b22] p-4">
            <h3 className="text-sm font-bold text-slate-200">
              Price history — {series.area}㎡ · {MONTHS[0]} →{' '}
              {MONTHS[MONTHS.length - 1]}
            </h3>
            <div className="mt-2 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={series.history}
                  margin={{ top: 8, right: 16, bottom: 0, left: 8 }}
                >
                  <CartesianGrid stroke="#2a1a4a" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(m: string) => m.slice(2)}
                    minTickGap={30}
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    domain={['auto', 'auto']}
                    tickFormatter={(v: number) => `₩${Math.round(v / 10000)}억`}
                    width={64}
                  />
                  <Tooltip content={<GhostTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#34d399"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: '#f97316' }}
                  />
                  <ReferenceDot
                    x={peak.month}
                    y={peak.price}
                    r={7}
                    fill="#f97316"
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              🟠 orange dot = the peak ghost (record high, {peak.month}). Hover
              the line to summon any month's price.
            </p>
          </div>

          {/* Ghost of Prices Past slider */}
          <div className="mt-4 rounded-2xl border border-orange-400/40 bg-[#1b1030] p-4">
            <h3 className="font-bold text-orange-300">
              👻 Ghost of Prices Past — time slider
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Drag the slider back in time. The ghost of{' '}
              <strong className="text-emerald-300">{past.month}</strong>{' '}
              whispers: this home cost{' '}
              <strong className="text-emerald-300">
                {formatPrice(past.price)}
              </strong>{' '}
              ({formatPriceKo(past.price)}) back then.
            </p>
            <input
              type="range"
              min={0}
              max={series.history.length - 1}
              value={sliderIdx}
              onChange={(e) => setSliderIdx(Number(e.target.value))}
              aria-label="Ghost of Prices Past — choose a past month"
              className="mt-4 w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>{MONTHS[0]}</span>
              <span>{past.month}</span>
              <span>{MONTHS[MONTHS.length - 1]}</span>
            </div>
            <div className="mt-4 grid gap-3 text-center md:grid-cols-3">
              <div className="rounded-xl bg-[#120b22] p-3">
                <div className="text-xs text-slate-400">Then · {past.month}</div>
                <div className="text-xl font-bold">{formatPrice(past.price)}</div>
              </div>
              <div className="rounded-xl bg-[#120b22] p-3">
                <div className="text-xs text-slate-400">
                  Change since then
                </div>
                <div
                  className={`text-xl font-bold ${ghostDelta >= 0 ? 'text-emerald-300' : 'text-red-300'}`}
                >
                  {ghostDelta >= 0 ? '+' : ''}
                  {ghostDelta.toFixed(1)}%
                </div>
              </div>
              <div className="rounded-xl bg-[#120b22] p-3">
                <div className="text-xs text-slate-400">Now · {latest.month}</div>
                <div className="text-xl font-bold">{formatPrice(latest.price)}</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {ghostDelta >= 0
                ? `The ghost grew richer: +${formatPrice(latest.price - past.price)} since ${past.month}.`
                : `The ghost lost ${formatPrice(past.price - latest.price)} since ${past.month} — a haunting, or a chance to buy?`}
            </p>
          </div>

          {/* school overlay */}
          <div className="mt-4 rounded-2xl border border-violet-400/25 bg-[#120b22] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold text-violet-300">
                🎓 School overlay — the neighbourhood's living spirits
              </h3>
              <button
                onClick={() => setShowSchools((v) => !v)}
                aria-expanded={showSchools}
                className="rounded-lg border border-violet-400/40 px-3 py-1.5 text-sm"
              >
                {showSchools ? 'Hide schools' : 'Show schools'}
              </button>
            </div>
            {showSchools && (
              <ul className="mt-3 grid gap-2 md:grid-cols-3">
                {selected.schools.map((s) => (
                  <li
                    key={s.nameEn}
                    className="rounded-xl border border-violet-400/20 bg-[#1b1030] p-3"
                  >
                    <div className="text-sm font-bold">
                      {s.type === 'Elementary'
                        ? '🏫'
                        : s.type === 'Middle'
                          ? '📚'
                          : '🎓'}{' '}
                      {s.nameEn}
                    </div>
                    <div className="text-xs text-slate-400">{s.nameKo}</div>
                    <div className="mt-1 text-xs">
                      {s.distanceM.toLocaleString()} m · ~{s.walkMin} min walk
                    </div>
                    <div className="mt-1 text-xs text-slate-400">{s.note}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ---------- watchlist ---------- */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-orange-300">
            ★ Your watchlist (saved in this browser)
          </h2>
          {watchlist.length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">
              No ghosts on watch yet. Tap ☆ on a complex card to keep an eye
              on its hauntings — saved in localStorage, no account needed.
            </p>
          ) : (
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {watchlist.map((id) => {
                const c = COMPLEXES.find((x) => x.id === id);
                if (!c) return null;
                const s0 = c.areas[0];
                return (
                  <li
                    key={id}
                    className="flex items-center justify-between rounded-xl border border-violet-400/25 bg-[#120b22] px-4 py-3"
                  >
                    <button
                      onClick={() => pickComplex(id)}
                      className="text-left text-sm font-semibold hover:text-emerald-300"
                    >
                      {c.nameEn} · {formatPrice(latestPoint(s0).price)} (
                      {s0.area}㎡)
                    </button>
                    <button
                      onClick={() => toggleWatch(id)}
                      className="text-slate-400 hover:text-red-300"
                      title="Remove from watchlist"
                    >
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>

      {/* ---------- footer ---------- */}
      <footer className="border-t border-violet-400/20 bg-[#120b22]">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-slate-400">
          <p>
            <strong className="text-slate-200">Data source &amp; honesty note.</strong>{' '}
            Prices are a bundled sample excerpt modeled on the Ministry of
            Land, Infrastructure and Transport (MOLIT) public real-transaction
            disclosures — verify any exact figure at{' '}
            <a
              className="text-emerald-300 underline"
              href="https://rt.molit.go.kr"
              target="_blank"
              rel="noreferrer"
            >
              rt.molit.go.kr
            </a>{' '}
            (open data: data.go.kr). Record-high months noted in the dataset
            match publicly reported record prices. The app runs fully offline
            from bundled data; a live data.go.kr adapter is sketched in{' '}
            <code>src/lib/molItApi.ts</code> for future use. School distances
            are approximate.
          </p>
          <p className="mt-2">
            Ghost Prices — built for Kiroween 2026 (Costume Contest). Source:{' '}
            <a
              className="text-emerald-300 underline"
              href="https://github.com/oracle77/ghost-prices"
              target="_blank"
              rel="noreferrer"
            >
              github.com/oracle77/ghost-prices
            </a>{' '}
            · MIT License · Not investment advice. The ghosts are metaphors;
            the prices are real-transaction medians.
          </p>
        </div>
      </footer>
    </div>
  );
}
