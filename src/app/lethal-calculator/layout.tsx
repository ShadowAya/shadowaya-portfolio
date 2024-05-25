import cn from 'classnames'
import localFont from 'next/font/local'
import styles from './layout.module.scss'
import { LethalValuesProvider } from '@/components/lethal-calculator/LethalValuesContext';
import { type Metadata } from 'next';

const mono = localFont({
    src: "./3270-Regular.otf",
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: "Lethal Calculator",
}

interface LayoutProps {
    children?: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {

    return (
        <LethalValuesProvider>
            <main className={cn(
                mono.className,
                styles.main
            )}>
                <div>
                    <div>
                        <div>
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </LethalValuesProvider>

    )

}