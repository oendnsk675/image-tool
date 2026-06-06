export interface HistoryEntry {
  id: string
  filename: string
  originalFormat: string
  outputFormat: string
  originalSize: number
  outputSize: number
  operation: 'convert' | 'remove-bg'
  createdAt: string
}

export const HISTORY_STORAGE_KEY = 'pixform.history'

export function getHistoryEntries(): HistoryEntry[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveHistoryEntries(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries))
}

export function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'createdAt'>) {
  const entries = getHistoryEntries()
  saveHistoryEntries([
    {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    },
    ...entries,
  ].slice(0, 200))
}

export function getFileFormat(file: File) {
  return file.type.replace('image/', '') || file.name.split('.').pop() || 'unknown'
}
