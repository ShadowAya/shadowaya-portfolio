import ComputerWindow from "@/components/ui/computerContents/ComputerWindow";
import Iconify from '@/components/Iconify';
import { GuideWindow } from '@/components/ClientStuff';
import StackItem from "@/components/ui/computerContents/StackItem";
import moment from 'moment-timezone';

export default function Home() {

    const birthday = moment.tz(new Date(2004, 0, 27), "Europe/Prague");
    const age = moment.tz("Europe/Prague").diff(birthday, 'years');

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
                        Math.floor(age) // 28.1.2004
                    }
                </StackItem>
                <StackItem>
                    <Iconify width={25} icon="ion:earth" />
                    CZ
                </StackItem>
                <StackItem>
                    <Iconify width={25} icon="ic:baseline-work" />
                    Seeking Opportunities
                </StackItem>
            </ComputerWindow>
            <GuideWindow />
        </>
    )
}
