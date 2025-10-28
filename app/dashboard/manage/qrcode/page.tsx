import Didyouknow from '@/app/components/didyouknow'
import React from 'react'
import Content from './content';
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "ThaiGuide – QR Code Management"
};

function Page() {
    const t = useTranslations('Dashboard.item');

    return (
        <>
            <main className='tg-container'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('qrcode.title')}</h1>
                    <div className='w-32 h-1.5 bg-primary mt-2'></div>
                </div>
                <p className='mt-4'>
                    {t('qrcode.decs')}
                </p>
            </main>
            <main className='max-w-7xl mx-auto px-4 pb-6'>
                <Content />
            </main>
            <Didyouknow />
        </>
    )
}

export default Page