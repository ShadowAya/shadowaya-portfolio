import ComputerWindow from "@/components/ui/computerContents/ComputerWindow";
import Iconify from '@/components/Iconify';
import { GuideWindow } from '@/components/ClientStuff';
import StackItem from "@/components/ui/computerContents/StackItem";

export default function Home() {

    return (
        <>
            <ComputerWindow
                width={400}
                height={300}
                top={30}
                left={60}
                title="home"
            >
                <h1>Hey there!</h1>
                <h3>I&apos;m shadow_aya</h3>
                <StackItem>
                    <Iconify width={25} icon="material-symbols:cake-outline" />
                    {
                        Math.floor((new Date().getTime() - new Date(2004, 0, 28).getTime()) / (1000 * 60 * 60 * 24 * 365))
                    }
                </StackItem>
                <StackItem>
                    <Iconify width={25} icon="ion:earth" />
                    CZ
                </StackItem>
                <StackItem>
                    <Iconify width={25} icon="ic:round-school" />
                    BUT FIT (ongoing)
                </StackItem>
            </ComputerWindow>
            <GuideWindow />
        </>
    )
}
