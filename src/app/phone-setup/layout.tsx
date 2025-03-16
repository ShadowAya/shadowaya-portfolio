import PhoneScreen from "@/components/phone-setup/PhoneScreen";
import styles from "./layout.module.scss";
import { PhoneContextProvider } from "@/components/phone-setup/context/PhoneContext";
import Nav from "@/components/phone-setup/Nav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <PhoneContextProvider>
            <div className={styles.container}>
                <section>
                    <PhoneScreen />
                </section>
                <section>
                    <Nav />
                    <div>{children}</div>
                </section>
            </div>
        </PhoneContextProvider>
    );
}
