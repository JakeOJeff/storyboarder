import React from 'react';

export function HackClubFlag({ width = 120 }: { width?: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 96 49.3"
            width={width}
            className=""
            aria-label="Hack Club Flag"
        >
            <path
                d="M0 0h96v49.3H0z"
                fill="#ec3750"
            />
            <path
                d="M20.4 20h-7.6v-7.6h7.6V20zm7.6 0h-7.6v-7.6h7.6V20zm0 7.6h-7.6V20h7.6v7.6zm-7.6 7.6h-7.6v-7.6h7.6v7.6zm10.2 0h-2.5v-7.6h7.6v2.5h-5.1v5.1zm22.9-7.6h-5.1v-2.5h5.1v2.5zm0 7.6h-5.1v-2.5h5.1v2.5zm-2.5-12.7h-7.6v-2.5h7.6v2.5zm2.5-5.1h-5.1v-2.5h5.1v2.5zm10.2 12.7h-2.5v-7.6h7.6v2.5h-5.1v5.1zm12.7 0h-7.6v-2.5h5.1v-2.5h-5.1V20h7.6v2.5h-5.1v2.5h5.1v5.2zm7.6-10.2h-2.5V20h2.5v2.4zm2.5 5.1h-2.5v-2.5h2.5v2.5zm0 5.1h-2.5v-2.5h2.5v2.5z"
                fill="#fff"
            />
        </svg>
    );
}
