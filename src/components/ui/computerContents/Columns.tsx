import styles from './Columns.module.scss';

interface ColumnsProps {
    children: React.ReactNode[];
}

export default function Columns({children}: ColumnsProps) {

    return (
        <div className={styles.column}>
            {children.map((content, i) => (
                <div key={i}>
                    {content}
                </div>
            ))}
        </div>
    )

}