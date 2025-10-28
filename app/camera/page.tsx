import React from 'react'
import Didyouknow from '../components/didyouknow'
import Cam from './cam'
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
    title: "ThaiGuide – Camera"
};

function Page() {
    const t = useTranslations('camera');

    return (
        <>
            <div className='tg-container'>
                <div>
                    <h1 className='font-bold text-4xl flex items-center gap-4'>{t('title')} <Badge className='text-white bg-primary'>{t('beta')}</Badge></h1>
                    <div className='w-32 h-1.5 bg-primary mt-2'></div>
                </div>
                <p className='mt-4'>{t('decs')}</p>
            </div>
            <Cam />
            <Didyouknow />
        </>
    )
}

export default Page