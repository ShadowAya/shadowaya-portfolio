import { type Metadata } from "next";
import Head from "next/head";


export const metadata: Metadata = {
    applicationName: 'Kustom Kompiler',
    icons: '/kustom-kompiler.png',
    alternates: {
        canonical: "https://shadowaya.me/kustom-kompiler",
    }
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}