import TGtitle from '@/app/components/tgtitle'
import React from 'react'
import NewForm from './form'
import type { Metadata } from 'next'
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "ThaiGuide – Add New Activity & Experience"
};

function Page() {
    const t = useTranslations('Dashboard.item.activities.add');

    return (
        <>
            <main className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} />
            </main>
            <NewForm />
        </>
    )
}

export default Page