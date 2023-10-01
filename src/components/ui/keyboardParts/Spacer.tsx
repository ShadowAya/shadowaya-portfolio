
interface SpacerProps {
    size?: number;
    horizontal?: boolean;
}

export default function Spacer({ size = 10, horizontal = false }: SpacerProps) {

    return (
        <>
            <hr
                style={
                    {
                        borderStyle: 'none',
                        borderWidth: 0,
                        [horizontal ? 'height' : 'width']: size,
                    }
                }
            />
        </>
    )

}