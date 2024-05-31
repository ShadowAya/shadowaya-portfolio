import Iconify from '@/components/Iconify';
import styles from './InlineLink.module.scss';


interface InlineLinkProps {
    href: string;
    blank?: boolean;
    children?: React.ReactNode;
}

export default function InlineLink({ href, children, blank = true }: InlineLinkProps) {

    return (
        <a
            href={href}
            className={styles.link}
            target={blank ? '_blank' : undefined}
        >
            <div>
                {children}
            </div>
            <div>
                <Iconify icon="iconamoon:arrow-right-2-bold" color="black" width="30" />
                <Iconify icon="iconamoon:arrow-right-2-bold" color="black" width="30" />
            </div>
        </a>
    )

}
