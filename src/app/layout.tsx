import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'shadow_aya ・ home',
    template: 'shadow_aya ・ %s',
  },
  description: 'ShadowAya\'s personal website',
  openGraph: {
    title: "shadow_aya's personal website",
    description: "portfolio, projects, contacts, and more",
    url: "https://shadowaya.me",
    siteName: "shadow_aya's portfolio"
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
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="darkreader-lock" />
        </head>
        <body className={inter.className}>
            {children}
        </body>
    </html>
  )
}
