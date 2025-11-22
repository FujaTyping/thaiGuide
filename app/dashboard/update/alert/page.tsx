import TGtitle from '@/app/components/tgtitle';
import React from 'react';
import type { Metadata } from 'next';
import FFORM from './form';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: 'ThaiGuide - Announcement Control'
}

function Page() {
    const t = useTranslations('Dashboard.item.alert')
    return (
        <>
            <section className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} />
                <div className='mt-4'>
                    <FFORM />
                </div>
            </section>
        </>
    )
}

export default Page