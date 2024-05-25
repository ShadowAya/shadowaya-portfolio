import NewBadge from "@/components/NewBadge";
import ComputerWindow from "@/components/ui/computerContents/ComputerWindow";
import InlineLink from "@/components/ui/computerContents/InlineLink";
import MyRepoCard from "@/components/ui/computerContents/MyRepoCard";
import Opacity from "@/components/ui/computerContents/Opacity";
import Image from "next/image";
import { Metadata } from "next/types";

export const metadata: Metadata = {
    title: "projects"
}

export default function Page() {

    return (<>
        <ComputerWindow
            top={30}
            left={250}
            height={300}
            width={400}
            title={'projects'}
        >
            <h2>Projects</h2>
            <p>
                Here&apos;s some of my projects.
                Feel free to check them out!
            </p>
        </ComputerWindow>
        <ComputerWindow
            top={200}
            left={20}
            height={440}
            width={330}
            delay={0.5}
        >
            <InlineLink href={"https://makogate.com/"}>
                <Image
                    src="/makogate.png"
                    alt="makogate"
                    width={45}
                    height={45}
                />
                <p>Makogate</p>
            </InlineLink>
            <InlineLink href={"https://wiseway.cz/"}>
                <Image
                    src="/wiseway.png"
                    alt="wiseway"
                    width={45}
                    height={45}
                />
                <p>Wiseway</p>
            </InlineLink>
            <h3>Via GitHub</h3>
            <div style={{position: 'relative'}}>
                <MyRepoCard repo={'anchor-card'} />
                <NewBadge text={'Added to HACS'} />
            </div>
        </ComputerWindow>
        <ComputerWindow
            top={240}
            left={360}
            height={280}
            width={330}
            title={'other'}
            delay={1}
        >
            <h4>Older Projects</h4>
            <InlineLink href={'https://shadowaya.github.io/timetable/'} >
                <p>Dynamic Timetable <Opacity opacity={0.7}>(KWGT + Tasker widget)</Opacity></p>
            </InlineLink>
            <InlineLink href={'https://shadowaya.github.io/dtg/'}>
                <p>Discord Timestamp Generator</p>
            </InlineLink>
        </ComputerWindow>
    </>)
}
