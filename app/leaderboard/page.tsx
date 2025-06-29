import React from 'react';
import type { Metadata } from "next";
import Main from './main';

export const metadata: Metadata = {
    title: "ThaiGuide – Leaderboard"
};

function Page() {
    return (
        <>
            <Main />
        </>
    )
}

export default Page