import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, ExternalLink, Check } from 'lucide-react';
import { US_VEP_STATES } from '../constants';

export function StateVepSelector() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<typeof US_VEP_STATES[number] | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = US_VEP_STATES.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.state.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-700 bg-black/40 px-4 py-3 text-sm text-zinc-300 transition-all hover:border-emerald-500/40"
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4 text-zinc-500" />
          {selected ? `${selected.name} (${selected.state})` : 'Select or search your state (e.g. Illinois, Colorado, NY...)'}
        </span>
        <ChevronDown className="h-4 w-4 text-zinc-500" />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-zinc-700 bg-ink-700 shadow-xl">
          <div className="border-b border-zinc-700 p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search state..."
              className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2 text-sm text-zinc-100 placeholder-slate-600 outline-none focus:border-emerald-500/60"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map((s) => (
              <button
                key={s.state}
                onClick={() => {
                  setSelected(s);
                  setOpen(false);
                  setQuery('');
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-700/60"
              >
                <span>
                  <span className="font-semibold text-zinc-200">{s.name}</span>
                  <span className="ml-2 text-xs text-zinc-500">{s.board}</span>
                </span>
                {selected?.state === s.state && <Check className="h-4 w-4 text-emerald-400" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-sm text-zinc-500">No state found.</p>
            )}
          </div>
        </div>
      )}

      {selected && (
        <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-100">{selected.name}</p>
              <p className="text-xs text-zinc-500">Gaming Board: {selected.board}</p>
            </div>
            <a
              href={selected.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-bold text-ink-900 transition-all hover:bg-emerald-500 active:scale-95"
            >
              Enroll in {selected.state} VEP
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
