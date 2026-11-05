import { useEffect, useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * columns: [{ key, label, render?(row, index) }]
 * searchKeys: row keys matched by the search box (omit to hide search)
 * actions: (row) => ReactNode, rendered in a trailing column
 */
export default function DataTable({ columns, rows, searchKeys, pageSize = 10, actions, toolbar, empty = 'No records found' }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !searchKeys) return rows;
    return rows.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)));
  }, [rows, query, searchKeys]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { if (page > pages) setPage(pages); }, [page, pages]);
  useEffect(() => { setPage(1); }, [query]);

  const start = (page - 1) * pageSize;
  const slice = filtered.slice(start, start + pageSize);

  return (
    <div className="rounded-xl bg-white shadow-sm">
      {(searchKeys || toolbar) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          {searchKeys ? (
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="field pl-9" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          ) : <span />}
          {toolbar}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              {columns.map((c) => <th key={c.key} className="whitespace-nowrap px-4 py-3 font-semibold">{c.label}</th>)}
              {actions && <th className="px-4 py-3 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 && (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-10 text-center text-slate-400">{empty}</td></tr>
            )}
            {slice.map((row, i) => (
              <tr key={row.id ?? i} className="border-t border-slate-100 hover:bg-slate-50">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 align-top">{c.render ? c.render(row, start + i) : row[c.key]}</td>
                ))}
                {actions && <td className="whitespace-nowrap px-4 py-3">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
        <span>{filtered.length ? `${start + 1}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length}` : '0 results'}</span>
        <div className="flex items-center gap-2">
          <button className="btn-ghost !px-2 !py-1" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft size={14} /></button>
          <span>Page {page} / {pages}</span>
          <button className="btn-ghost !px-2 !py-1" disabled={page >= pages} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
