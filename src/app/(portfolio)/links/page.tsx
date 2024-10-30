import Iconify from "@/components/Iconify";
import ComputerWindow from "@/components/ui/computerContents/ComputerWindow";
import InlineLink from "@/components/ui/computerContents/InlineLink";
import InlineRect from "@/components/ui/computerContents/InlineRect";
import Opacity from "@/components/ui/computerContents/Opacity";
import { Metadata } from "next/types";

export const metadata: Metadata = {
    title: "links",
    alternates: {
        canonical: "https://shadowaya.me/links",
    }
}

export default function Page() {

    return (<>
        <ComputerWindow
            top={50}
            left={100}
            height={650}
            width={400}
            title={'links'}
        >
            <h2>My Links</h2>
            <p>
                My socials. If you wish to connect with me, I&apos;m most likely going to reply via Discord.
            </p>
            <br />
            <p>
                Open to any questions, suggestions, or just a chat!
            </p>
            <br />
            <InlineLink href={"https://github.com/ShadowAya"}>
                <Iconify icon="mdi:github" color="black" width="30" />
                <p>GitHub</p>
            </InlineLink>
            <InlineRect>
                <Iconify icon="ic:baseline-discord" color="black" width="30" />
                <p><Opacity opacity={0.8}>Discord at </Opacity>shadow_aya</p>
            </InlineRect>
            <InlineLink href={"https://twitter.com/shadow_aya_dev"}>
                <Iconify icon="mdi:twitter" color="black" width="30" />
                <p>Twitter</p>
            </InlineLink>
            <InlineLink href={"https://steamcommunity.com/id/shadow_aya/"}>
                <Iconify icon="mdi:steam" color="black" width="30" />
                <p>Steam</p>
            </InlineLink>
            <InlineLink href={"https://stats.fm/shadow_aya"}>
                <Iconify icon="mdi:spotify" color="black" width="30" />
                <p>stats.fm</p>
            </InlineLink>

        </ComputerWindow>

    </>)
}
