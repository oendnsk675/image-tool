import { ComingSoon } from '@/components/coming-soon'
import { ArchiveIcon } from 'lucide-react'

export default function CompressorPage() {
  return (
    <ComingSoon
      title="Compressor"
      description="Compress images to reduce file size"
      icon={<ArchiveIcon className="h-12 w-12" />}
    />
  )
}
