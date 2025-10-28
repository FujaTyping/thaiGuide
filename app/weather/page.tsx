import React from 'react';
import Embed from './embed';
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';
import Didyouknow from "@/app/components/didyouknow";
import Simulation from './simulation';
import { TriangleAlert } from 'lucide-react';

export const metadata: Metadata = {
    title: "ThaiGuide – Weather and Temperature"
};

function Page() {
    const t = useTranslations('WeaATem');

    return (
        <>
            <main className='tg-container'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-primary mt-2'></div>
                </div>
                <p className='mt-4'>{t('decs')}</p>
                <div className='mt-8'>
                    <Embed />
                </div>
                <div>
                    <h1 className='font-bold text-4xl'>{t('stitle')}</h1>
                    <div className='w-32 h-1.5 bg-primary mt-2'></div>
                </div>
                <p className='mt-4'>{t('sdecs')}</p>
                <div className='mt-2'>
                    <p className='flex items-center gap-2 text-primary'><TriangleAlert /> <b>{t('simu.ntitle')}</b><br /></p>
                    <p className='mt-1'>{t('simu.notice')}</p>
                </div>
                <div className='mt-6'>
                    <Simulation />
                </div>
            </main>
            <Didyouknow />
        </>
    )
}

export default Page