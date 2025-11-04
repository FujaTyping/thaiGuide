import React from 'react'
import TGtitle from '../components/tgtitle'
import Content from './content'
import { useTranslations } from 'next-intl';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ThaiGuide – Install ThaiGuide"
};

function Page() {
    const t = useTranslations('Install');

    return (
        <>
            <div className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} />
                <Content />
            </div>

        </>
    )
}

export default Page