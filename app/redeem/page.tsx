import React from 'react';
import type { Metadata } from "next";
import Grid from './grid';
import { useTranslations } from 'next-intl';
import Didyouknow from "@/app/components/didyouknow";

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
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                    <p className='mt-3'>{t('decs')}</p>
                </div>
                <Grid />
                <div className='mt-12'>
                    <h1 className='font-bold text-4xl'>{t('ptitle')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                    <p className='mt-3'>{t('pdecs')}</p>
                </div>
                <div className='mt-3 flex flex-col gap-4'>
                    {
                        Data.map((item, index) => (
                            <div key={index} className='flex flex-col md:flex-row items-center gap-4'>
                                <div className='text-white bg-[#f7740a] w-fit p-2 px-4 font-bold text-xl rounded-full'>
                                    {index + 1}
                                </div>
                                <p className='font-semibold text-lg'>{t(`tips.${item}`)}</p>
                            </div>
                        ))
                    }
                </div>
            </main>
            <Didyouknow />
        </>
    )
}

export default Page