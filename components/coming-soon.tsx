import { SparklesIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ComingSoonProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export function ComingSoon({ title, description, icon }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="text-muted-foreground">
        {icon ?? <SparklesIcon className="h-12 w-12" />}
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
        Coming Soon
      </span>
      <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/converter" />}>
        Back to Converter
      </Button>
    </div>
  )
}
