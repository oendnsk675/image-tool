'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { Upload, Download, X, Loader2, Eraser, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProgressBar } from '@/components/progress-bar'
import { formatBytes, cn } from '@/lib/utils'
import { toast } from 'sonner'

interface RemoveBgItem {
  id: string
  file: File
  previewUrl: string
  status: 'idle' | 'processing' | 'done' | 'error'
  outputBlob?: Blob
  errorMessage?: string
}

let idCounter = 0

const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/avif': ['.avif'],
}

export default function RemoveBgPage() {
  const [items, setItems] = useState<RemoveBgItem[]>([])
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  const onDrop = useCallback((accepted: File[]) => {
    const newItems: RemoveBgItem[] = accepted.map((file) => ({
      id: `rbg-${++idCounter}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'idle',
    }))
    setItems((prev) => [...prev, ...newItems].slice(0, 20))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 10 * 1024 * 1024,
    maxFiles: 20,
  })

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) URL.revokeObjectURL(item.previewUrl)
      return prev.filter((i) => i.id !== id)
    })
  }

  const processAll = async () => {
    const toProcess = items.filter((i) => i.status === 'idle' || i.status === 'error')
    if (!toProcess.length) return

    setProcessing(true)

    await Promise.all(
      toProcess.map(async (item) => {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'processing' } : i))
        )

        const formData = new FormData()
        formData.append('file', item.file)

        try {
          const res = await fetch('/api/remove-bg', { method: 'POST', body: formData })

          if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            setItems((prev) =>
              prev.map((i) =>
                i.id === item.id
                  ? { ...i, status: 'error', errorMessage: data.error ?? 'Failed' }
                  : i
              )
            )
            return
          }

          const blob = await res.blob()
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, status: 'done', outputBlob: blob } : i
            )
          )
        } catch {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, status: 'error', errorMessage: 'Network error' } : i
            )
          )
        }
      })
    )

    setProcessing(false)
    toast.success('Background removal complete')
  }

  const downloadItem = (item: RemoveBgItem) => {
    if (!item.outputBlob) return
    const url = URL.createObjectURL(item.outputBlob)
    const a = document.createElement('a')
    const base = item.file.name.replace(/\.[^.]+$/, '')
    a.href = url
    a.download = `${base}-no-bg.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  const sendToConverter = (item: RemoveBgItem) => {
    if (!item.outputBlob) return
    const file = new File([item.outputBlob], item.file.name.replace(/\.[^.]+$/, '') + '-no-bg.png', {
      type: 'image/png',
    })
    const reader = new FileReader()
    reader.onload = () => {
      try {
        sessionStorage.setItem('pendingFile', JSON.stringify({
          name: file.name,
          type: file.type,
          data: reader.result,
        }))
        router.push('/converter')
      } catch {
        toast.error('Could not send to converter')
      }
    }
    reader.readAsDataURL(item.outputBlob)
  }

  const pendingCount = items.filter((i) => i.status === 'idle' || i.status === 'error').length

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Eraser className="h-6 w-6" />
          Remove Background
        </h1>
        <p className="text-muted-foreground text-sm">
          Automatically remove image backgrounds using AI (RMBG-1.4 model)
        </p>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer p-10 transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="font-medium">Drop images here or click to select</p>
        <p className="text-sm text-muted-foreground mt-1">
          JPEG, PNG, WebP, AVIF · Max 10MB
        </p>
      </div>

      {items.length > 0 && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-muted-foreground">
              {items.length} image{items.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setItems([])}
                disabled={processing}
              >
                Clear all
              </Button>
              <Button
                size="sm"
                onClick={processAll}
                disabled={processing || pendingCount === 0}
                className="gap-2"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Eraser className="h-4 w-4" />
                )}
                Remove BG {pendingCount > 0 ? `(${pendingCount})` : ''}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card key={item.id} className={cn(item.status === 'error' && 'border-destructive/50')}>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-center">Original</p>
                      <div className="relative aspect-square rounded overflow-hidden bg-muted border">
                        <Image
                          src={item.previewUrl}
                          alt="original"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground text-center">Result</p>
                      <div
                        className="relative aspect-square rounded overflow-hidden border"
                        style={{
                          backgroundImage:
                            'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%)',
                          backgroundSize: '16px 16px',
                        }}
                      >
                        {item.outputBlob ? (
                          <Image
                            src={URL.createObjectURL(item.outputBlob)}
                            alt="result"
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            {item.status === 'processing' ? (
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            ) : (
                              <span className="text-xs text-muted-foreground">Pending</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs truncate flex-1">{item.file.name}</p>
                    <div className="flex items-center gap-1 ml-2">
                      {item.status === 'idle' && <Badge variant="secondary" className="text-xs">Ready</Badge>}
                      {item.status === 'processing' && <Badge variant="outline" className="text-xs">Processing</Badge>}
                      {item.status === 'done' && <Badge className="text-xs bg-green-500">Done</Badge>}
                      {item.status === 'error' && <Badge variant="destructive" className="text-xs">Error</Badge>}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {item.status === 'processing' && <ProgressBar value={50} showLabel={false} />}

                  {item.status === 'error' && (
                    <p className="text-xs text-destructive">{item.errorMessage}</p>
                  )}

                  {item.status === 'done' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1 h-8 text-xs"
                        onClick={() => downloadItem(item)}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download PNG
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 gap-1 h-8 text-xs"
                        onClick={() => sendToConverter(item)}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        Convert
                      </Button>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {formatBytes(item.file.size)}
                    {item.outputBlob && ` → ${formatBytes(item.outputBlob.size)}`}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
