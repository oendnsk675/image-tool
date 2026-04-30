'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/avif': ['.avif'],
  'image/gif': ['.gif'],
  'image/bmp': ['.bmp'],
  'image/tiff': ['.tiff', '.tif'],
  'image/svg+xml': ['.svg'],
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 20

interface DropzoneProps {
  onFiles: (files: File[]) => void
  currentCount?: number
  className?: string
}

export function Dropzone({ onFiles, currentCount = 0, className }: DropzoneProps) {
  const remaining = MAX_FILES - currentCount

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) onFiles(accepted.slice(0, remaining))
    },
    [onFiles, remaining]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: remaining,
    disabled: remaining <= 0,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors cursor-pointer p-10',
        isDragActive && !isDragReject && 'border-primary bg-primary/5',
        isDragReject && 'border-destructive bg-destructive/5',
        !isDragActive && !isDragReject && 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30',
        remaining <= 0 && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full bg-muted p-4">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        {isDragActive && !isDragReject ? (
          <p className="text-primary font-medium">Drop files here...</p>
        ) : isDragReject ? (
          <p className="text-destructive font-medium">Some files are not supported</p>
        ) : remaining <= 0 ? (
          <p className="text-muted-foreground font-medium">Maximum {MAX_FILES} files reached</p>
        ) : (
          <>
            <p className="font-medium text-foreground">
              Drop images here or click to upload
            </p>
            <p className="text-sm text-muted-foreground">
              JPEG, PNG, WebP, AVIF, GIF, BMP, TIFF, SVG &middot; Max 10MB per file &middot; {remaining} more remaining
            </p>
          </>
        )}
      </div>
    </div>
  )
}
