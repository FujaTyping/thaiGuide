import React from 'react';
import type { Metadata } from 'next';
import TGtitle from '@/app/components/tgtitle';
import Content from './content';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: 'ThaiGuide – Badge Management'
}

function Page() {
    const t = useTranslations('Dashboard.item.badge');

    return (
        <>
            <main className='tg-container w-full'>
                <TGtitle title={t('title')} decs={t('decs')} />
                <div className='mt-4 w-full'>
                    <Content />
                </div>
            </main>
        </>
    )
}

export default Page