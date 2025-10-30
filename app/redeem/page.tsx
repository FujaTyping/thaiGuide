import React from 'react';
import type { Metadata } from "next";
import Grid from './grid';
import { useTranslations } from 'next-intl';
import Didyouknow from "@/app/components/didyouknow";
import TGtitle from '../components/tgtitle';

export const metadata: Metadata = {
    title: "ThaiGuide – Redeem"
};

const Data = [
    "0",
    "1",
    "2"
]

function Page() {
    const t = useTranslations('Redeem');

    return (
        <>
            <main className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} />
                <Grid />
                <TGtitle title={t('ptitle')} decs={t('pdecs')} />
                <div className='mt-3 flex flex-col gap-4'>
                    {
                        Data.map((item, index) => (
                            <div key={index} className='flex flex-col md:flex-row items-center gap-4'>
                                <div className='text-white bg-primary w-fit p-2 px-4 font-bold text-xl rounded-full'>
                                    {index + 1}
                                </div>
                                <p className='font-semibold text-lg'>{t(`tips.${item}`)}</p>
                            </div>
                        ))
                    }
                </div>
            </main>
            
        </>
    )
}

export default Page