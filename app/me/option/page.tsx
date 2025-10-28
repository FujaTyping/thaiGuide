import React from 'react'
import type { Metadata } from "next";
import Didyouknow from '@/app/components/didyouknow';
import Setting from './setting';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "ThaiGuide – Option"
};

function Page() {
    const t = useTranslations('Account');

    return (
        <>
            <main className='max-w-7xl mx-auto px-4 pt-6'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-primary mt-2'></div>
                </div>
                <p className='mt-4'>{t('decs')}</p>
            </main>
            <Setting />
            <Didyouknow />
        </>
    )
}

export default Page