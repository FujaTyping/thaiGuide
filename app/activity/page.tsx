import React from 'react';
import type { Metadata } from "next";
import Grid from './grid';
import { useTranslations } from 'next-intl';
import Didyouknow from "@/app/components/didyouknow";
import TGtitle from '../components/tgtitle';

export const metadata: Metadata = {
    title: "ThaiGuide – Activity and Events"
};

function Page() {
    const t = useTranslations('Activities');

    return (
        <>
            <main className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} />
                <Grid />
            </main>
            
        </>
    )
}

export default Page