import { Suspense } from "react";
import Loading from "@/components/stratle/Loading";
import RootLayout from "@/components/stratle/RootLayout";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <Suspense fallback={<Loading />}>
            <RootLayout>
                {children}
            </RootLayout>
        </Suspense>  
    );
}