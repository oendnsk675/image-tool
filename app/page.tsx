'use client'

import Link from 'next/link'
import {
  ArrowLeftRightIcon,
  EraserIcon,
  SparklesIcon,
  ShieldCheckIcon,
  LeafIcon,
  WandSparklesIcon,
  DownloadIcon,
  ZapIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'

export default function LandingPage() {
  const { data: session } = useSession()
  const loggedIn = !!session?.user

  const ctaHref = loggedIn ? '/converter' : '/signup'

  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <SparklesIcon className="h-6 w-6 text-primary" />
            Pixform
          </Link>
          <div className="flex items-center gap-3">
            {loggedIn ? (
              <Button nativeButton={false} render={<Link href="/converter" />}>Go to Converter</Button>
            ) : (
              <>
                  <Button variant="ghost" nativeButton={false} render={<Link href="/signin" />}>
                  Sign In
                </Button>
                <Button nativeButton={false} render={<Link href="/signup" />}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ========= Hero ========= */}
        <section className="relative overflow-hidden px-6 py-20 md:py-32">
          {/* Subtle matcha blob */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] opacity-20"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% -20%, oklch(0.627 0.173 157.3 / 0.3), transparent)',
            }}
          />
          <div
            className="pointer-events-none absolute -right-40 top-20 -z-10 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, oklch(0.78 0.08 155), transparent)' }}
          />
          <div
            className="pointer-events-none absolute -left-40 bottom-0 -z-10 h-[400px] w-[400px] rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, oklch(0.627 0.173 157.3 / 0.5), transparent)' }}
          />

          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
              <WandSparklesIcon className="h-4 w-4" />
              AI-powered image tools
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Transform your images{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
                effortlessly
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
              Batch convert formats, remove backgrounds with AI, and optimize your images
              — all in one place. Free, fast, and fully private.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" nativeButton={false} className="gap-2 text-base" render={<Link href={ctaHref} />}>
                <ArrowLeftRightIcon className="h-5 w-5" />
                Start Converting
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} className="gap-2 text-base" render={<Link href={ctaHref} />}>
                <EraserIcon className="h-5 w-5" />
                Remove Background
              </Button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              No credit card required. Works directly in your browser.
            </p>
          </div>
        </section>

        {/* ========= Stats ========= */}
        <section className="border-y border-border/40 px-6 py-12">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '6+', label: 'Formats' },
              { value: '10MB', label: 'Max File Size' },
              { value: '20', label: 'Batch Limit' },
              { value: '100%', label: 'Private' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========= How it Works ========= */}
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                How it works
              </h2>
              <p className="text-muted-foreground">
                Three simple steps to transform your images
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '01',
                  icon: <DownloadIcon className="h-8 w-8" />,
                  title: 'Upload',
                  desc: 'Drag & drop your images or click to select. Support for JPEG, PNG, WebP, AVIF, and more.',
                },
                {
                  step: '02',
                  icon: <WandSparklesIcon className="h-8 w-8" />,
                  title: 'Configure',
                  desc: 'Choose your output format, adjust quality, set dimensions, or remove backgrounds with AI.',
                },
                {
                  step: '03',
                  icon: <ZapIcon className="h-8 w-8" />,
                  title: 'Export',
                  desc: 'Convert instantly and download your images individually or as a ZIP archive.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="group relative rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.03]"
                >
                  <span className="absolute right-4 top-4 text-4xl font-bold text-emerald-500/10 transition-colors group-hover:text-emerald-500/20">
                    {item.step}
                  </span>
                  <div className="mb-4 rounded-xl bg-emerald-500/10 p-3 w-fit text-primary">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========= Features ========= */}
        <section className="px-6 py-20 md:py-28 bg-card/30">
          <div className="mx-auto max-w-5xl">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Everything you need
              </h2>
              <p className="text-muted-foreground">
                Powerful tools to handle all your image conversion needs
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <ArrowLeftRightIcon className="h-6 w-6" />,
                  title: 'Format Converter',
                  desc: 'Convert JPEG, PNG, WebP, AVIF, GIF, BMP, TIFF, and SVG with quality control.',
                },
                {
                  icon: <EraserIcon className="h-6 w-6" />,
                  title: 'Background Removal',
                  desc: 'Remove backgrounds with RMBG-1.4 AI model. Works on portraits, products, and more.',
                },
                {
                  icon: <ShieldCheckIcon className="h-6 w-6" />,
                  title: 'Private Processing',
                  desc: 'Everything processed locally. Your files never leave your device. Zero uploads.',
                },
                {
                  icon: <LeafIcon className="h-6 w-6" />,
                  title: 'Quality Control',
                  desc: 'Adjust compression quality from 1–100%. Balance file size and visual fidelity.',
                },
                {
                  icon: <ZapIcon className="h-6 w-6" />,
                  title: 'Batch Processing',
                  desc: 'Convert up to 20 images at once. Download individually or as a ZIP archive.',
                },
                {
                  icon: <SparklesIcon className="h-6 w-6" />,
                  title: 'Smart Resize',
                  desc: 'Set custom dimensions with aspect ratio lock. Resize while converting.',
                },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-emerald-500/20"
                >
                  <div className="mb-3 rounded-lg bg-emerald-500/10 p-2 w-fit text-primary">
                    {feat.icon}
                  </div>
                  <h3 className="font-semibold">{feat.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========= CTA ========= */}
        <section className="relative overflow-hidden px-6 py-20 md:py-28">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-15"
            style={{
              background:
                'radial-gradient(ellipse 50% 80% at 50% 50%, oklch(0.627 0.173 157.3 / 0.5), transparent)',
            }}
          />
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Ready to transform your images?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Start converting in seconds. No sign-up required for quick access.
            </p>
            <div className="mt-8">
              <Button size="lg" nativeButton={false} className="gap-2 text-base" render={<Link href={ctaHref} />}>
                <ArrowLeftRightIcon className="h-5 w-5" />
                Get Started Free
              </Button>
            </div>
          </div>
        </section>

        {/* ========= Footer ========= */}
        <footer className="border-t border-border/40 px-6 py-10">
          <div className="mx-auto max-w-6xl flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <SparklesIcon className="h-5 w-5 text-primary" />
              Pixform
            </Link>
            <p className="text-xs text-muted-foreground">
              Made with <LeafIcon className="inline h-3 w-3 text-emerald-500" /> for creators everywhere.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link href="/converter" className="hover:text-foreground transition-colors">Converter</Link>
              <Link href="/remove-bg" className="hover:text-foreground transition-colors">Remove BG</Link>
              <Link href="/settings" className="hover:text-foreground transition-colors">Settings</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
