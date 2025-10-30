import React from 'react';
import type { Metadata } from "next";
import TInput from './input';
import { useTranslations } from 'next-intl';
import Didyouknow from "@/app/components/didyouknow";
import TGtitle from '../components/tgtitle';

export const metadata: Metadata = {
    title: "ThaiGuide – Trip Planner"
};

function Page() {
    const t = useTranslations('Planner');

    return (
        <>
            <main className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} badge={t('beta')} />
                <TInput />
            </main>
            
        </>
    )
}

export default Page