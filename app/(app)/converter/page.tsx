'use client'

import { useCallback, useEffect, useState } from 'react'
import JSZip from 'jszip'
import { ImageIcon, Download, Trash2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dropzone } from '@/components/dropzone'
import { FileCard } from '@/components/file-card'
import { useConverterStore } from '@/store/converter'
import { toast } from 'sonner'

export default function ConverterPage() {
  const { files, addFiles, clearAll, setConverting, setDone, setError, setProgress } =
    useConverterStore()
  const [isConverting, setIsConverting] = useState(false)

  useEffect(() => {
    const pending = sessionStorage.getItem('pendingFile')
    if (!pending) return
    sessionStorage.removeItem('pendingFile')
    try {
      const { name, type, data } = JSON.parse(pending)
      fetch(data)
        .then((r) => r.blob())
        .then((blob) => {
          const file = new File([blob], name, { type })
          addFiles([file])
        })
    } catch {
      // ignore
    }
  }, [addFiles])

  const handleFiles = useCallback(
    (newFiles: File[]) => addFiles(newFiles),
    [addFiles]
  )

  const convertAll = async () => {
    const toConvert = files.filter((f) => f.status === 'idle' || f.status === 'error')
    if (toConvert.length === 0) return

    setIsConverting(true)

    await Promise.all(
      toConvert.map(async (item) => {
        setConverting(item.id)

        const formData = new FormData()
        formData.append('file', item.file)
        formData.append('outputFormat', item.outputFormat)
        formData.append('quality', String(item.quality))
        if (item.width) formData.append('width', String(item.width))
        if (item.height) formData.append('height', String(item.height))
        formData.append('maintainAspectRatio', String(item.maintainAspectRatio))

        try {
          setProgress(item.id, 30)

          const res = await fetch('/api/convert', { method: 'POST', body: formData })

          setProgress(item.id, 80)

          if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            setError(item.id, data.error ?? 'Conversion failed')
            return
          }

          const blob = await res.blob()
          setDone(item.id, blob, blob.size)
        } catch {
          setError(item.id, 'Network error')
        }
      })
    )

    setIsConverting(false)
    toast.success('Conversion complete')
  }

  const downloadAll = async () => {
    const done = files.filter((f) => f.status === 'done' && f.outputBlob)
    if (done.length === 0) return

    if (done.length === 1) {
      const item = done[0]
      const url = URL.createObjectURL(item.outputBlob!)
      const a = document.createElement('a')
      const base = item.file.name.replace(/\.[^.]+$/, '')
      a.href = url
      a.download = `${base}.${item.outputFormat}`
      a.click()
      URL.revokeObjectURL(url)
      return
    }

    const zip = new JSZip()
    done.forEach((item) => {
      const base = item.file.name.replace(/\.[^.]+$/, '')
      zip.file(`${base}.${item.outputFormat}`, item.outputBlob!)
    })
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted-images.zip'
    a.click()
    URL.revokeObjectURL(url)
  }

  const pendingCount = files.filter((f) => f.status === 'idle' || f.status === 'error').length
  const doneCount = files.filter((f) => f.status === 'done').length

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ImageIcon className="h-6 w-6" />
          Image Converter
        </h1>
        <p className="text-muted-foreground text-sm">
          Convert images between formats with quality and resize control
        </p>
      </div>

      <Dropzone onFiles={handleFiles} currentCount={files.length} />

      {files.length > 0 && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-muted-foreground">
              {files.length} file{files.length !== 1 ? 's' : ''} · {doneCount} converted
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                disabled={isConverting}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear all
              </Button>
              {doneCount > 0 && (
                <Button variant="outline" size="sm" onClick={downloadAll} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download all{doneCount > 1 ? ' (ZIP)' : ''}
                </Button>
              )}
              <Button
                size="sm"
                onClick={convertAll}
                disabled={isConverting || pendingCount === 0}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Convert {pendingCount > 0 ? `(${pendingCount})` : ''}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((item) => (
              <FileCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
