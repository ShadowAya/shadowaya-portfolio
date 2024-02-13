import styles from './NewBadge.module.scss';
import Iconify from "./Iconify";

interface NewBadgeProps {
    text: string;
}

export default function NewBadge({ text }: NewBadgeProps) {

    return (
        <div className={styles.badge}>
            <Iconify icon="mdi:stars" height={16} />
            <span>{text}</span>
        </div>
    )

}