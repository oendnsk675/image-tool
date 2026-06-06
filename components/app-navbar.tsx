"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { title: "Home", url: "/" },
  { title: "Converter", url: "/converter" },
  { title: "Remove BG", url: "/remove-bg" },
]

export function AppNavbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <SparklesIcon className="h-6 w-6 text-primary" />
          Pixform
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button
              key={item.url}
              variant={pathname === item.url ? "secondary" : "ghost"}
              size="sm"
              nativeButton={false}
              render={<Link href={item.url} />}
            >
              {item.title}
            </Button>
          ))}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Open navigation</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            {navItems.map((item) => (
              <DropdownMenuItem key={item.url} render={<Link href={item.url} />}>
                {item.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
