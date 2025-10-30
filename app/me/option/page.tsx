import React from 'react'
import type { Metadata } from "next";
import Didyouknow from '@/app/components/didyouknow';
import Setting from './setting';
import { useTranslations } from 'next-intl';
import TGtitle from '@/app/components/tgtitle';

export const metadata: Metadata = {
    title: "ThaiGuide – Option"
};

function Page() {
    const t = useTranslations('Account');

    return (
        <>
            <main className='max-w-7xl mx-auto px-4 pt-6'>
                <TGtitle title={t('title')} decs={t('decs')} />
            </main>
            <Setting />
            
        </>
    )
}

export default Page