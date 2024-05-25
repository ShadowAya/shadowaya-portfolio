import GlobalEffects from "@/components/GlobalEffects";
import { DeviceProvider } from "@/components/context/DeviceContext";
import { KeyboardProvider } from "@/components/context/KeyboardContext";
import { ScreenSizeProvider } from "@/components/context/ScreenSizeContext";
import Keyboard from "@/components/ui/Keyboard";
import { MonitorMain, MonitorSecondary } from "@/components/ui/Monitors";
import SideNav from "@/components/ui/SideNav";
import TopWarning from "@/components/ui/TopWarning";
import MonitorIcon from "@/components/ui/computerContents/MonitorIcon";
import Loading from "../loading";
import styles from './layout.module.scss';


const navItems = [
    {
        icon: 'ant-design:home-outlined',
        title: 'Home',
        href: '/',
    },
    {
        icon: 'iconoir:dev-mode-laptop',
        title: 'Experience',
        href: '/experience',
    },
    {
        icon: 'tabler:tools',
        title: 'Projects',
        href: '/projects',
    },
    {
        icon: 'mingcute:link-line',
        title: 'Links',
        href: '/links',
    },
]

export default function Layout({
    children,
}: {
  children: React.ReactNode
}) {

    return (<>

        <KeyboardProvider>
        <ScreenSizeProvider>
        <DeviceProvider>
        <GlobalEffects>
        
            <TopWarning />

            <main className={styles.main}><div>
                <Keyboard
                    style={{
                        scale: 0.5,
                    }}
                />
                <div className={styles.monitors}>
                    <MonitorMain>
                        {children}
                    </MonitorMain>
                    <MonitorSecondary>
                        <MonitorIcon
                            {...navItems[0]}
                            top={200}
                            left={100}
                        />
                        <MonitorIcon
                            {...navItems[1]}
                            top={320}
                            left={-80}
                        />
                        <MonitorIcon
                            {...navItems[2]}
                            top={390}
                            left={130}
                        />
                        <MonitorIcon
                            {...navItems[3]}
                            top={480}
                            left={-20}
                        />
                    </MonitorSecondary>
                </div>
            </div></main>

            <SideNav items={navItems} />

        </GlobalEffects>
        </DeviceProvider>
        </ScreenSizeProvider>
        </KeyboardProvider>

        <Loading />

    </>)

}