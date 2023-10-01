import styles from './InlineRect.module.scss';

interface InlineRectProps {
    children?: React.ReactNode;
}

export default function InlineRect({ children }: InlineRectProps) {

    return (
        <div className={styles.container}>
            {children}
        </div>
    )

}