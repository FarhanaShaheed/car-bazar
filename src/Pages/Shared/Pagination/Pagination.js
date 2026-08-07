import React from 'react';

/* Shared pagination. Numbered pages with ellipsis for long ranges,
   prev/next arrows and a "showing x–y of z" line. */

const pageList = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out = [1];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);
  if (from > 2) out.push('…');
  for (let i = from; i <= to; i += 1) out.push(i);
  if (to < total - 1) out.push('…');
  out.push(total);
  return out;
};

const Pagination = ({ page, pageSize, total, onChange, label = 'cars' }) => {
  const pages = Math.ceil(total / pageSize) || 1;
  if (pages < 2) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  const go = (n) => onChange(Math.min(Math.max(n, 1), pages));

  return (
    <nav className="cb-pager" aria-label={`${label} pagination`}>
      <p className="cb-pager-count">
        Showing <b>{first}–{last}</b> of {total} {label}
      </p>
      <div className="cb-pager-btns">
        <button type="button" onClick={() => go(page - 1)} disabled={page === 1} aria-label="Previous page">
          <i className="fas fa-chevron-left" />
        </button>
        {pageList(page, pages).map((n, i) =>
          n === '…' ? (
            <span key={`gap-${i}`} className="cb-pager-gap">…</span>
          ) : (
            <button
              type="button"
              key={n}
              className={n === page ? 'is-on' : ''}
              onClick={() => go(n)}
              aria-current={n === page ? 'page' : undefined}
              aria-label={`Page ${n}`}
            >
              {n}
            </button>
          )
        )}
        <button type="button" onClick={() => go(page + 1)} disabled={page === pages} aria-label="Next page">
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
