
interface KeysProps {
    amount?: number;
    width?: number;
    height?: number;
}

export default function Keys({ amount = 1, width, height }: KeysProps) {

    return (
        <>
            {
                Array.from({ length: amount }, (v, i) => i).map((i) => (
                    <div
                        key={i}
                        style={
                            {
                                width: width ? width : undefined,
                                height: height ? height : undefined,
                                marginBottom: height ? 30 - height : undefined,
                            }
                        }
                    />
                ))
            }
        </>
    )

}