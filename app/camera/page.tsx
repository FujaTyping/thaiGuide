import React from 'react'
import Didyouknow from '../components/didyouknow'
import Cam from './cam'
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';
import TGtitle from '../components/tgtitle';

export const metadata: Metadata = {
    title: "ThaiGuide – Camera"
};

function Page() {
    const t = useTranslations('camera');

    return (
        <>
            <div className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} badge={t('beta')} />
            </div>
            <Cam />
            
        </>
    )
}

export default Page