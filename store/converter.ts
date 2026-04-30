import { create } from 'zustand'
import type { OutputFormat } from '@/lib/sharp'

export type ConvertStatus = 'idle' | 'converting' | 'done' | 'error'

export interface FileItem {
  id: string
  file: File
  previewUrl: string
  outputFormat: OutputFormat
  quality: number
  width?: number
  height?: number
  maintainAspectRatio: boolean
  status: ConvertStatus
  progress: number
  outputBlob?: Blob
  outputSize?: number
  errorMessage?: string
}

interface ConverterState {
  files: FileItem[]
  globalProgress: number
  addFiles: (files: File[]) => void
  removeFile: (id: string) => void
  updateFile: (id: string, updates: Partial<FileItem>) => void
  clearAll: () => void
  setProgress: (id: string, progress: number) => void
  setConverting: (id: string) => void
  setDone: (id: string, blob: Blob, size: number) => void
  setError: (id: string, message: string) => void
}

let idCounter = 0

export const useConverterStore = create<ConverterState>((set) => ({
  files: [],
  globalProgress: 0,

  addFiles: (newFiles) =>
    set((state) => {
      const existing = state.files.length
      const toAdd = newFiles.slice(0, 20 - existing)
      const items: FileItem[] = toAdd.map((file) => ({
        id: `file-${++idCounter}-${Date.now()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        outputFormat: 'webp',
        quality: 85,
        maintainAspectRatio: true,
        status: 'idle',
        progress: 0,
      }))
      return { files: [...state.files, ...items] }
    }),

  removeFile: (id) =>
    set((state) => {
      const item = state.files.find((f) => f.id === id)
      if (item) URL.revokeObjectURL(item.previewUrl)
      return { files: state.files.filter((f) => f.id !== id) }
    }),

  updateFile: (id, updates) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  clearAll: () =>
    set((state) => {
      state.files.forEach((f) => URL.revokeObjectURL(f.previewUrl))
      return { files: [] }
    }),

  setProgress: (id, progress) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, progress } : f)),
    })),

  setConverting: (id) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, status: 'converting', progress: 0 } : f
      ),
    })),

  setDone: (id, blob, size) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id
          ? { ...f, status: 'done', progress: 100, outputBlob: blob, outputSize: size }
          : f
      ),
    })),

  setError: (id, message) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, status: 'error', errorMessage: message } : f
      ),
    })),
}))
