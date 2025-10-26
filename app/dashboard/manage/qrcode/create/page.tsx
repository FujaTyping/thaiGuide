import React from 'react';
import type { Metadata } from "next";
import Didyouknow from '@/app/components/didyouknow';
import NewForm from './form';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "ThaiGuide – Create new Qr Code"
};

function Page() {
    const t = useTranslations('Dashboard.item.qrcode.create');

    return (
        <>
            <main className='tg-container'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>
                    {t('decs')}
                </p>
            </main>
            <NewForm />
            <Didyouknow />
        </>
    )
}

export default Page