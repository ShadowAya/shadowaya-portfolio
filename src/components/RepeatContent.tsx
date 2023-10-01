import React from "react";

interface RepeatContentProps {
    times: number;
    children: React.ReactNode;
}

function RepeatContent({ times, children }: RepeatContentProps) {
    return (
        <>
            {Array.from({ length: times }).map((_, index) => (
                <React.Fragment key={index}>{children}</React.Fragment>
            ))}
        </>
    );
}

export default RepeatContent;
