import React from 'react';
import Embed from './embed';
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "ThaiGuide – Weather and Temperature"
};

function Page() {
    const t = useTranslations('WeaATem');

    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>{t('decs')}</p>
                <div className='mt-12'>
                    <Embed />
                </div>
            </main>
        </>
    )
}

export default Page