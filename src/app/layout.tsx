import { KeyboardProvider } from '@/components/context/KeyboardContext'
import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import styles from './layout.module.scss';
import Keyboard from "@/components/ui/Keyboard";
import { MonitorMain, MonitorSecondary } from '@/components/ui/Monitors';
import GlobalEffects from '@/components/GlobalEffects';
import MonitorIcon from '@/components/ui/computerContents/MonitorIcon';
import TopWarning from '@/components/ui/TopWarning';
import { ScreenSizeProvider } from '@/components/context/ScreenSizeContext';
import { DeviceProvider } from '@/components/context/DeviceContext';
import Loading from './loading';
import SideNav from '@/components/ui/SideNav';

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
    url: "https://shadowaya.vercel.com",
    siteName: "shadow_aya's portfolio"
  }
}

const navItems = [
    {
        icon: 'ant-design:home-outlined',
        title: 'Home',
        href: '/',
    },
    {
        icon: 'iconoir:dev-mode-laptop',
        title: 'Experience',
        href: '/experience',
    },
    {
        icon: 'tabler:tools',
        title: 'Projects',
        href: '/projects',
    },
    {
        icon: 'mingcute:link-line',
        title: 'Links',
        href: '/links',
    },
]

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
            <KeyboardProvider>
            <ScreenSizeProvider>
            <DeviceProvider>
            <GlobalEffects>
            
                <TopWarning />

                <main><div>
                    <Keyboard
                        style={{
                            scale: 0.5,
                        }}
                    />
                    <div className={styles.monitors}>
                        <MonitorMain>
                            {children}
                        </MonitorMain>
                        <MonitorSecondary>
                            <MonitorIcon
                                {...navItems[0]}
                                top={200}
                                left={100}
                            />
                            <MonitorIcon
                                {...navItems[1]}
                                top={320}
                                left={-80}
                            />
                            <MonitorIcon
                                {...navItems[2]}
                                top={390}
                                left={130}
                            />
                            <MonitorIcon
                                {...navItems[3]}
                                top={480}
                                left={-20}
                            />
                        </MonitorSecondary>
                    </div>
                </div></main>

                <SideNav items={navItems} />

            </GlobalEffects>
            </DeviceProvider>
            </ScreenSizeProvider>
            </KeyboardProvider>

            <Loading />

        </body>
    </html>
  )
}
