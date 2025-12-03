import React from 'react';
import Embed from './embed';
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';
import Didyouknow from "@/app/components/didyouknow";
import Simulation from './simulation';
import { TriangleAlert } from 'lucide-react';
import TGtitle from '../components/tgtitle';

export const metadata: Metadata = {
    title: "ThaiGuide – Weather and Temperature"
};

function Page() {
    const t = useTranslations('WeaATem');

    return (
        <>
            <main className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} />
                <div className='mt-8'>
                    <Embed />
                </div>
                <TGtitle title={t('stitle')} decs={t('sdecs')} second={true} />
                <div className='mt-2'>
                    <p className='flex items-center gap-2 text-primary'><TriangleAlert /> <b>{t('simu.ntitle')}</b><br /></p>
                    <p className='mt-1'>{t('simu.notice')}</p>
                </div>
                <div className='mt-6'>
                    <Simulation />
                </div>
            </main>
        </>
    )
}

export default Page