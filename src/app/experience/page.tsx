import ComputerWindow from "@/components/ui/computerContents/ComputerWindow";
import Iconify from "@/components/Iconify";
import StackItem from "@/components/ui/computerContents/StackItem";
import Columns from "@/components/ui/computerContents/Columns";
import Opacity from "@/components/ui/computerContents/Opacity";
import { Metadata } from "next/types";

export const metadata: Metadata = {
    title: "experience"
}

export default function Page() {

    return (<>
        <ComputerWindow
            top={40}
            left={40}
            height={440}
            width={450}
            title={'experience'}
        >
            <h2>My primary stack</h2>
            <StackItem>
                <Iconify icon="akar-icons:typescript-fill" color="white" width="30" />
                <p>TypeScript</p>
            </StackItem>
            <h3>Web dev</h3>
            <Columns>
                <>
                    <h4>Frontend</h4>
                    <StackItem>
                        <Iconify icon="akar-icons:nextjs-fill" color="white" width="30" />
                        <p>NextJS</p>
                        <Iconify icon="mdi:react" color="white" width="30" />
                        <p>React</p>
                    </StackItem>
                </>
                <>
                    <h4>Backend</h4>
                    <StackItem>
                        <Iconify icon="skill-icons:expressjs-light" color="white" width="30" />
                        <p>Express</p>
                    </StackItem>
                </>
            </Columns>
            <h3>Chat bots</h3>
            <StackItem>
                <Iconify icon="ic:baseline-discord" color="white" width="30" />
                <p>Discord.js</p>
            </StackItem>
            
        </ComputerWindow>
        <ComputerWindow
            top={200}
            left={400}
            height={350}
            width={280}
            delay={0.5}
        >
            <h2>Other</h2>
            <StackItem>
                <Iconify icon="bxl:java" color="white" width="30" />
                <p>Java <Opacity opacity={0.7}>(basics, Bukkit plugins)</Opacity></p>
            </StackItem>
            <StackItem>
                <Iconify icon="mdi:language-csharp" color="white" width="30" />
                <p>C# <Opacity opacity={0.7}>(basics)</Opacity></p>
            </StackItem>
            <StackItem>
                <Iconify icon="simple-icons:python" color="white" width="30" />
                <p>Python <Opacity opacity={0.7}>(basics, scripting)</Opacity></p>
            </StackItem>
        </ComputerWindow>
        <ComputerWindow
            top={410}
            left={80}
            height={350}
            width={280}
            delay={1}
            title="some extras"
        >
            <h2>Miscellaneous</h2>
            <StackItem>
                <Iconify icon="simple-icons:homeassistant" color="white" width="30" />
                <p>Home Assistant <Opacity opacity={0.7}><br />(also card dev)</Opacity></p>
            </StackItem>
            <h3>Android</h3>
            <StackItem>
                <Iconify icon="arcticons:tasker" color="white" width="30" />
                <p>
                    Tasker
                    <Opacity opacity={0.7}><br />(automation)</Opacity>
                </p>
            </StackItem>
            <StackItem>
                <Iconify icon="arcticons:kwgt" color="white" width="30" />
                <p>
                    KWGT
                    <Opacity opacity={0.7}><br />(widgets)</Opacity>
                </p>
            </StackItem>

        </ComputerWindow>
        <ComputerWindow
            top={500}
            left={380}
            height={280}
            width={250}
            delay={1.5}
            title="future"
        >
            <h2>Plans</h2>
            <StackItem>
                <Iconify icon="fa6-solid:c" color="white" width="20" />
                <p>
                    C
                    <Opacity opacity={0.5}> and other </Opacity>
                    Low level
                    <Opacity opacity={0.7}><br />(studying)</Opacity>
                </p>
            </StackItem>
            <StackItem>
                <Iconify icon="icon-park-twotone:chip" color="white" width="30" />
                <p>
                    More Hardware
                    <Opacity opacity={0.7}> (namely ESP32)</Opacity>
                </p>
            </StackItem>
            <StackItem>
                <Iconify icon="material-symbols:android" color="white" width="30" />
                <p>
                    Mobile apps
                    <Opacity opacity={0.7}> (via React Native or Kotlin)</Opacity>
                </p>
            </StackItem>
        </ComputerWindow>
    </>)
}
