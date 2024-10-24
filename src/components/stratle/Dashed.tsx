
import cn from 'classnames';
import styles from './Dashed.module.scss'

interface DashedProps {
    height?: string;
    width?: string;
    absolute?: string | undefined;
    rotate?: boolean;
    small?: boolean;
    className?: string;
}

export default function Dashed({
    height,
    width,
    absolute,
    rotate = false,
    small = false,
    className,
}: DashedProps) {
    return <div
        className={cn(styles.dashed, className)}
        style={{
            height: height ? height : (absolute ? `calc(100% - ${absolute} - ${absolute})` : undefined),
            width: width ? width : (absolute ? `calc(100% - ${absolute} - ${absolute})` : undefined),
            position: absolute ? 'absolute' : undefined,
            top: absolute,
            left: absolute,
            '--dashes-deg': rotate ? '225deg' : '135deg',
            backgroundSize: small ? '10px 10px' : '20px 20px',
        }}
    />
}