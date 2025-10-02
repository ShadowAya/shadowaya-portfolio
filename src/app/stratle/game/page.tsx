import Order from "@/components/stratle/Order";
import styles from './page.module.scss';
import StratagemPanel from "@/components/stratle/StratagemPanel";
import Inputs from "@/components/stratle/Inputs";

export default function Page() {

    return (
        <section className={styles.page}>
            <div>
                <Inputs />
            </div>
            <div>
                <StratagemPanel />
                <Order />
            </div>
        </section>
    );
}