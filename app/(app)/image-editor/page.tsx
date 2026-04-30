import { ComingSoon } from '@/components/coming-soon'
import { PencilRulerIcon } from 'lucide-react'

export default function ImageEditorPage() {
  return (
    <ComingSoon
      title="Image Editor"
      description="Edit and enhance your images"
      icon={<PencilRulerIcon className="h-12 w-12" />}
    />
  )
}
