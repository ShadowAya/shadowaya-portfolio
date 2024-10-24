import Box from './Box'
import styles from './NavItem.module.scss'
import Dashed from './Dashed';
import NavItemWrapper from './NavItemWrapper';

interface NavItemProps {
    selected?: boolean;
    link?: string;
    setMode?: 'daily' | 'endless';
    title: string;
    num: number;
}

export default function NavItem({
    selected = false,
    link,
    setMode,
    title,
    num,
}: NavItemProps) {

    return (
        <NavItemWrapper
            selected={selected}
            link={link}
            setMode={setMode}
        >
            <Box className={styles.box1} hideRight hideTop>
                <span className={styles.title}>{title}</span>
                <Dashed className={styles.deco1} />
            </Box>
            <span className={styles.num}>{num}</span>
            <Box className={styles.box2} hideLeft hideTop>
                <Dashed className={styles.deco2} />
            </Box>
        </NavItemWrapper>
    );
}