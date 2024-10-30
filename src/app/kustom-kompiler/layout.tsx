import { type Metadata } from "next";


export const metadata: Metadata = {
    title: 'Kustom Kompiler',
    description: 'A Code to Kustom-syntax compiler',
    applicationName: 'Kustom Kompiler',
    icons: '/kustom-kompiler.png',
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}