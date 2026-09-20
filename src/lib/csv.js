/**
 * Tiny CSV helpers (RFC-4180-ish) for client-side exports.
 */

/** Escape a single cell for CSV. */
export function csvCell(value) {
  const s = value == null ? '' : String(value);
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Build a CSV string from an array of row objects using column keys. */
export function toCsv(rows, columns) {
  const header = columns.map((c) => csvCell(c.label)).join(',');
  const body = rows
    .map((row) => columns.map((c) => csvCell(row[c.key])).join(','))
    .join('\n');
  return `${header}\n${body}\n`;
}

/** Trigger a browser download of a string as a file. */
export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
