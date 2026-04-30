import { ComingSoon } from '@/components/coming-soon'
import { LayoutTemplateIcon } from 'lucide-react'

export default function TemplatesPage() {
  return (
    <ComingSoon
      title="Templates"
      description="Use pre-made templates for your images"
      icon={<LayoutTemplateIcon className="h-12 w-12" />}
    />
  )
}
