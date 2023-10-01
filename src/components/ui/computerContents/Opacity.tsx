
interface OpacityProps {
    opacity: number;
    children: React.ReactNode;
    type?: 'span' | 'div';
}

export default function Opacity({ opacity, children, type = 'span' }: OpacityProps) {
    return (
        <>
            {type === 'span' ? (
                <span style={{ opacity }}>
                    {children}
                </span>
            ) : (
                <div style={{ opacity }}>
                    {children}
                </div>
            )}
        </>
    )
}