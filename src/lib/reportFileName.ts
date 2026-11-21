// e.g. "Villa Sunset_2026-11" — year-month so files sort chronologically
export function reportFileName(name: string, year: number, month: number) {
  const safeName = name.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim()
  return `${safeName}_${year}-${String(month).padStart(2, '0')}`
}
