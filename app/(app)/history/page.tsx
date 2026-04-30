'use client'

import { useEffect, useState } from 'react'
import { History, Trash2, RefreshCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatBytes } from '@/lib/utils'
import { toast } from 'sonner'

interface HistoryEntry {
  id: string
  filename: string
  originalFormat: string
  outputFormat: string
  originalSize: number
  outputSize: number
  operation: 'convert' | 'remove-bg'
  createdAt: string
}

const ITEMS_PER_PAGE = 10

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/history')
      const { data } = await res.json()
      setEntries(data ?? [])
    } catch {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const deleteEntry = async (id: string) => {
    try {
      await fetch(`/api/history?id=${id}`, { method: 'DELETE' })
      setEntries((prev) => prev.filter((e) => e.id !== id))
      toast.success('Entry deleted')
    } catch {
      toast.error('Failed to delete entry')
    }
  }

  const deleteAll = async () => {
    try {
      await fetch('/api/history', { method: 'DELETE' })
      setEntries([])
      toast.success('History cleared')
    } catch {
      toast.error('Failed to clear history')
    }
  }

  const filtered = entries.filter((e) => {
    const matchesSearch = e.filename.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || e.operation === filter
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  useEffect(() => { setPage(1) }, [search, filter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="h-6 w-6" />
            Conversion History
          </h1>
          <p className="text-muted-foreground text-sm">{entries.length} total entries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchHistory} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          {entries.length > 0 && (
            <Button variant="destructive" size="sm" onClick={deleteAll} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {entries.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search filename..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={(v) => v && setFilter(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Operations</SelectItem>
              <SelectItem value="convert">Convert</SelectItem>
              <SelectItem value="remove-bg">Remove BG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <History className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">
              {entries.length === 0 ? 'No conversions yet' : 'No matching entries'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {paginated.map((entry, i) => (
              <div key={entry.id}>
                {i > 0 && <Separator />}
                <div className="flex items-center gap-4 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(entry.originalSize)} → {formatBytes(entry.outputSize)}
                      {' · '}
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {entry.originalFormat.toUpperCase()} → {entry.outputFormat.toUpperCase()}
                    </Badge>
                    <Badge
                      variant={entry.operation === 'remove-bg' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {entry.operation === 'remove-bg' ? 'Remove BG' : 'Convert'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
