import Didyouknow from '@/app/components/didyouknow'
import React from 'react'
import Content from './content';
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';
import TGtitle from '@/app/components/tgtitle';

export const metadata: Metadata = {
    title: "ThaiGuide – QR Code Management"
};

function Page() {
    const t = useTranslations('Dashboard.item');

    return (
        <>
            <main className='tg-container'>
                <TGtitle title={t('qrcode.title')} decs={t('qrcode.decs')} />
            </main>
            <main className='max-w-7xl mx-auto px-4 pb-6'>
                <Content />
            </main>
        </>
    )
}

export default Page