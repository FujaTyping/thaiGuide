"use client";

import Script from "next/script";

declare global {
    interface Window {
        Tally?: {
            loadEmbeds: () => void;
        };
    }
}

const TallyScript = () => {
    return (
        <Script
            id="tally-js"
            src="https://tally.so/widgets/embed.js"
            strategy="afterInteractive"
            onLoad={() => {
                window.Tally?.loadEmbeds();
            }}
        />
    );
};

export default TallyScript;