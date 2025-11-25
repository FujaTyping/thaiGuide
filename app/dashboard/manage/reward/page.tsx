import TGtitle from '@/app/components/tgtitle'
import React from 'react';
import type { Metadata } from "next";
import Content from './content';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: 'ThaiGuide - Reward Management'
}

function Page() {
    const t = useTranslations('Dashboard.item');

    return (
        <>
            <section className='tg-container'>
                <TGtitle title={t('reward.title')} decs={t('reward.decs')} />
                <div className='mt-5'>
                    <Content />
                </div>
            </section>
        </>
    )
}

export default Page