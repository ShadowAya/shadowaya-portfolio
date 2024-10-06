import Code from "@/components/kustom-kompiler/Code";

export const metadata = {
    title: {
        default: 'Kustom Kompiler',
        template: 'Kustom Kompiler - %s'
    },
    description: 'A code to Kustom-syntax compiler',
    openGraph: {
        title: 'Kustom Kompiler',
        description: 'A code to Kustom-syntax compiler',
        url: 'https://shadowaya.me/kustom-kompiler',
        siteName: 'shadow_aya\'s portfolio'
    }
};

export default function Page() {

    return (
        <Code />
    )

}