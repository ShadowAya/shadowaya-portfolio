import styles from './StackItem.module.scss';


interface StackItemProps {
    children?: React.ReactNode;
}

export default function StackItem({children}: StackItemProps) {

    return (
        <span className={styles.item}>
            {children}
        </span>
    )

}