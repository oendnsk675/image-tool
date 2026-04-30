import { ComingSoon } from '@/components/coming-soon'
import { CrownIcon } from 'lucide-react'

export default function UpgradePage() {
  return (
    <ComingSoon
      title="Upgrade to Pro"
      description="Unlock all premium features"
      icon={<CrownIcon className="h-12 w-12" />}
    />
  )
}
