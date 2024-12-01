import { Suspense } from "react";
import Loading from "@/components/stratle/Loading";
import RootLayout from "@/components/stratle/RootLayout";
import { type Metadata } from "next";

interface LayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: "Stratle",
    description: "A Wordle Game for HELLDIVERS 2 Stratagems",
    applicationName: "Stratle",
    icons: "/stratle-icon.png",
    openGraph: {
        type: "website",
        url: "https://shadowaya.me/stratle",
        title: "Stratle",
        siteName: "Stratle",
        description: "A Wordle Game for HELLDIVERS 2 Stratagems",
        images: ["https://shadowaya.me/hd2-bg.png"],
    },
    twitter: {
        creator: "@shadow_aya_dev",
        card: "summary_large_image",
        images: ["https://shadowaya.me/hd2-bg.png"],
    },
    alternates: {
        canonical: "https://shadowaya.me/stratle",
    },
    manifest: "/stratle-manifest.json",
};

export const revalidate = 3600;

export default function Layout({ children }: LayoutProps) {
    return (
        <Suspense fallback={<Loading />}>
            <RootLayout>{children}</RootLayout>
        </Suspense>
    );
}
