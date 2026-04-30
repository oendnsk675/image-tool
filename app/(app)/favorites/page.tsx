import { ComingSoon } from '@/components/coming-soon'
import { StarIcon } from 'lucide-react'

export default function FavoritesPage() {
  return (
    <ComingSoon
      title="Favorites"
      description="Your favorite conversions and settings"
      icon={<StarIcon className="h-12 w-12" />}
    />
  )
}
