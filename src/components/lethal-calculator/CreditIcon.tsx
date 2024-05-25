import styles from './CreditIcon.module.scss';

interface CreditIconProps {
    height?: number;
}

export default function CreditIcon({ height = 25 }: CreditIconProps) {

    return (
        <div className={styles.credit} style={{
            height: `${height}px`
        }} />
    )

}