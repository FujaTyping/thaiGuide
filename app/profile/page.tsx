import React from 'react';
import Card from './card';
import Details from './details';
import Qr from './qr';
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';
import Didyouknow from "@/app/components/didyouknow";

export const metadata: Metadata = {
    title: "ThaiGuide – My Profile"
};

function Page() {
    const t = useTranslations('Profile');

    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>{t('decs')}</p>
                <Card />
                <div>
                    <h1 className='font-bold text-2xl'>{t('transaction.title')}</h1>
                </div>
                <Details />
            </main>
            <Qr />
            <Didyouknow />
        </>
    )
}

export default Page