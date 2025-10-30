import React from 'react';
import Card from './card';
import Qr from './qr';
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';
import Didyouknow from "@/app/components/didyouknow";
import Main from './main';
import TGtitle from '../components/tgtitle';

export const metadata: Metadata = {
    title: "ThaiGuide – My Profile"
};

function Page() {
    const t = useTranslations('Profile');

    return (
        <>
            <main className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} />
                <Card />
                <Main />
            </main>
            <Qr />
            
        </>
    )
}

export default Page