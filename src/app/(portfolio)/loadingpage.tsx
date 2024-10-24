'use client';

import { useEffect, useState } from "react";

export default function Loading() {

    const [show, setShow] = useState(true);

    useEffect(() => {
        setShow(false);
    }, []);

    return (
        <div
            style={{
                display: show ? 'flex' : 'none',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
                backgroundColor: '#131313',
                zIndex: 999,
                position: 'fixed',
                top: 0,
                left: 0,
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 48 48"><mask id="ipTNewComputer0"><g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4"><rect width="36" height="28" x="6" y="6" fill="#555" rx="3"/><path strokeLinecap="round" d="M14 42h20m-10-8v8"/></g></mask><path fill="white" d="M0 0h48v48H0z" mask="url(#ipTNewComputer0)"/></svg>
        </div>
    )

}