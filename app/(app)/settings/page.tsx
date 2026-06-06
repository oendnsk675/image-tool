'use client'

import { useEffect, useState } from 'react'
import { Settings, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import type { OutputFormat } from '@/lib/sharp'

const OUTPUT_FORMATS: { value: OutputFormat; label: string }[] = [
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
  { value: 'avif', label: 'AVIF' },
  { value: 'gif', label: 'GIF' },
  { value: 'bmp', label: 'BMP' },
]

const DEFAULTS = {
  defaultFormat: 'webp' as OutputFormat,
  defaultQuality: 85,
}

const SETTINGS_STORAGE_KEY = 'pixform.settings'

export default function SettingsPage() {
  const [defaultFormat, setDefaultFormat] = useState<OutputFormat>(DEFAULTS.defaultFormat)
  const [defaultQuality, setDefaultQuality] = useState(DEFAULTS.defaultQuality)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
      const data = raw ? JSON.parse(raw) : null
      if (data?.defaultFormat) setDefaultFormat(data.defaultFormat as OutputFormat)
      if (data?.defaultQuality) setDefaultQuality(Number(data.defaultQuality))
    } catch {}
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ defaultFormat, defaultQuality }))
      toast.success('Settings saved')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm">Configure default conversion preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Converter Defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Default output format</Label>
            <Select
              value={defaultFormat}
              onValueChange={(v) => setDefaultFormat(v as OutputFormat)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OUTPUT_FORMATS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Format applied to new files added to the converter
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Default quality</Label>
              <span className="text-sm font-medium">{defaultQuality}</span>
            </div>
            <Slider
              min={1}
              max={100}
              step={1}
              value={[defaultQuality]}
              onValueChange={(vals) => {
                const v = Array.isArray(vals) ? vals[0] : vals
                setDefaultQuality(v as number)
              }}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Applies to lossy formats: JPEG, WebP, AVIF
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Saving…' : 'Save settings'}
        </Button>
      </div>
    </div>
  )
}
