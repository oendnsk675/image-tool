"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HomeIcon, ArrowLeftRightIcon, LayoutGridIcon, ArchiveIcon, PencilRulerIcon, LayoutTemplateIcon, HistoryIcon, StarIcon, CrownIcon, Settings2Icon, RemoveFormattingIcon, SparklesIcon } from "lucide-react"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: <HomeIcon className="size-5" />,
    },
    {
      title: "Converter",
      url: "/converter",
      icon: <ArrowLeftRightIcon className="size-5" />,
    },
    {
      title: "Remove BG",
      url: "/remove-bg",
      icon: <RemoveFormattingIcon className="size-5" />,
    },
    {
      title: "Bulk Resize",
      url: "/bulk-resize",
      icon: <LayoutGridIcon className="size-5" />,
      disabled: true,
    },
    {
      title: "Compressor",
      url: "/compressor",
      icon: <ArchiveIcon className="size-5" />,
      disabled: true,
    },
    {
      title: "Image Editor",
      url: "/image-editor",
      icon: <PencilRulerIcon className="size-5" />,
      disabled: true,
    },
    {
      title: "Templates",
      url: "/templates",
      icon: <LayoutTemplateIcon className="size-5" />,
      disabled: true,
    },
    {
      title: "History",
      url: "/history",
      icon: <HistoryIcon className="size-5" />,
    },
    {
      title: "Favorites",
      url: "/favorites",
      icon: <StarIcon className="size-5" />,
      disabled: true,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: <Settings2Icon className="size-5" />,
    },
  ],
  upgrade: {
    title: "Upgrade to Pro",
    url: "/upgrade",
    icon: <CrownIcon className="size-5" />,
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              size="lg"
              render={<Link href="/" />}
            >
              <SparklesIcon className="size-6 text-primary" />
              <span className="text-lg font-bold">Pixform</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />

        <div className="mx-3 mt-4 rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/5 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
            <CrownIcon className="size-4" />
            <span>Upgrade to Pro</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Unlock all features including bulk resize, compressor, and more.
          </p>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
