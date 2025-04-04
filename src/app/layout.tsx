import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'home ・ shadow_aya',
    template: '%s ・ shadow_aya',
  },
  description: 'ShadowAya\'s personal website',
  applicationName: 'shadow_aya',
  openGraph: {
    title: "shadow_aya's personal website",
    description: "portfolio, projects, contacts, and more",
    url: "https://shadowaya.me",
    siteName: "shadow_aya's portfolio"
  },
  alternates: {
    canonical: "https://www.shadowaya.me",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <head>
            <meta name="darkreader-lock" />
        </head>
        <body className={inter.className}>
            {children}
            <SpeedInsights />
        </body>
    </html>
  )
}
