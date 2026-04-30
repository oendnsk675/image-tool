'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Download, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProgressBar } from '@/components/progress-bar'
import { FileItem, useConverterStore } from '@/store/converter'
import type { OutputFormat } from '@/lib/sharp'
import { cn, formatBytes } from '@/lib/utils'

const OUTPUT_FORMATS: { value: OutputFormat; label: string }[] = [
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
  { value: 'avif', label: 'AVIF' },
  { value: 'gif', label: 'GIF' },
  { value: 'bmp', label: 'BMP' },
]

const LOSSY_FORMATS: OutputFormat[] = ['jpeg', 'webp', 'avif']

interface FileCardProps {
  item: FileItem
}

export function FileCard({ item }: FileCardProps) {
  const { removeFile, updateFile } = useConverterStore()
  const [showResize, setShowResize] = useState(false)
  const [previewSide, setPreviewSide] = useState<'before' | 'after'>('before')

  const isLossy = LOSSY_FORMATS.includes(item.outputFormat)
  const hasOutput = item.status === 'done' && item.outputBlob

  const handleDownload = () => {
    if (!item.outputBlob) return
    const url = URL.createObjectURL(item.outputBlob)
    const a = document.createElement('a')
    const baseName = item.file.name.replace(/\.[^.]+$/, '')
    a.href = url
    a.download = `${baseName}.${item.outputFormat}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className={cn(
      'overflow-hidden transition-all',
      item.status === 'error' && 'border-destructive/50'
    )}>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Thumbnail */}
          <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden bg-muted border">
            {hasOutput && previewSide === 'after' ? (
              <Image
                src={URL.createObjectURL(item.outputBlob!)}
                alt="output preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <Image
                src={item.previewUrl}
                alt={item.file.name}
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.file.name}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(item.file.size)}</p>
            {item.status === 'done' && item.outputSize != null && (
              <p className="text-xs text-green-600 dark:text-green-400">
                → {formatBytes(item.outputSize)}{' '}
                <span className="text-muted-foreground">
                  ({item.outputSize < item.file.size ? '-' : '+'}
                  {Math.abs(Math.round((1 - item.outputSize / item.file.size) * 100))}%)
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {item.status === 'idle' && (
              <Badge variant="secondary" className="text-xs">Ready</Badge>
            )}
            {item.status === 'converting' && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            {item.status === 'done' && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            {item.status === 'error' && (
              <AlertCircle className="h-4 w-4 text-destructive" />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => removeFile(item.id)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Before/After toggle */}
        {hasOutput && (
          <div className="flex gap-1 text-xs">
            <button
              onClick={() => setPreviewSide('before')}
              className={cn(
                'px-2 py-0.5 rounded',
                previewSide === 'before' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Before
            </button>
            <button
              onClick={() => setPreviewSide('after')}
              className={cn(
                'px-2 py-0.5 rounded',
                previewSide === 'after' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              After
            </button>
          </div>
        )}

        {/* Error message */}
        {item.status === 'error' && item.errorMessage && (
          <p className="text-xs text-destructive">{item.errorMessage}</p>
        )}

        {/* Progress */}
        {item.status === 'converting' && (
          <ProgressBar value={item.progress} />
        )}

        {/* Config */}
        {item.status !== 'converting' && (
          <div className="space-y-3">
            {/* Format selector */}
            <div className="flex items-center gap-2">
              <Label className="text-xs w-16 shrink-0">Format</Label>
              <Select
                value={item.outputFormat}
                onValueChange={(v) => updateFile(item.id, { outputFormat: v as OutputFormat })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OUTPUT_FORMATS.map((f) => (
                    <SelectItem key={f.value} value={f.value} className="text-xs">
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quality slider (lossy only) */}
            {isLossy && (
              <div className="flex items-center gap-2">
                <Label className="text-xs w-16 shrink-0">Quality</Label>
                <div className="flex-1 flex items-center gap-2">
                  <Slider
                    min={1}
                    max={100}
                    step={1}
                    value={[item.quality]}
                    onValueChange={(vals) => {
                      const v = Array.isArray(vals) ? vals[0] : vals
                      updateFile(item.id, { quality: v as number })
                    }}
                    className="flex-1"
                  />
                  <span className="text-xs w-7 text-right text-muted-foreground">
                    {item.quality}
                  </span>
                </div>
              </div>
            )}

            {/* Resize toggle */}
            <button
              className="text-xs text-primary hover:underline"
              onClick={() => setShowResize((v) => !v)}
            >
              {showResize ? 'Hide resize options' : 'Resize options'}
            </button>

            {showResize && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">Width (px)</Label>
                    <Input
                      type="number"
                      className="h-8 text-xs mt-1"
                      placeholder="auto"
                      value={item.width ?? ''}
                      onChange={(e) =>
                        updateFile(item.id, {
                          width: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Height (px)</Label>
                    <Input
                      type="number"
                      className="h-8 text-xs mt-1"
                      placeholder="auto"
                      value={item.height ?? ''}
                      onChange={(e) =>
                        updateFile(item.id, {
                          height: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.maintainAspectRatio}
                    onChange={(e) =>
                      updateFile(item.id, { maintainAspectRatio: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-xs text-muted-foreground">Maintain aspect ratio</span>
                </label>
              </div>
            )}
          </div>
        )}

        {/* Download button */}
        {hasOutput && (
          <Button size="sm" variant="outline" className="w-full gap-2 h-8" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
