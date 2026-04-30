import { ComingSoon } from '@/components/coming-soon'
import { LayoutGridIcon } from 'lucide-react'

export default function BulkResizePage() {
  return (
    <ComingSoon
      title="Bulk Resize"
      description="Resize multiple images at once"
      icon={<LayoutGridIcon className="h-12 w-12" />}
    />
  )
}
