import React from 'react';
import type { Metadata } from "next";
import Grid from './grid';
import { useTranslations } from 'next-intl';
import Didyouknow from "@/app/components/didyouknow";

export const metadata: Metadata = {
    title: "ThaiGuide – Road Trip"
};

function Page() {
    const t = useTranslations('RoadTrip');

    return (
        <>
            <main className='tg-container'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                    <p className='mt-4'>{t('decs')}</p>
                </div>
                <Grid />
            </main>
            <Didyouknow />
        </>
    )
}

export default Page