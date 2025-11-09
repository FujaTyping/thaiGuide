import TGtitle from '@/app/components/tgtitle'
import React from 'react'
import Scanner from './scanner'
import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'

export const metadata: Metadata = {
    title: 'ThaiGuide - Reward Redemption Management'
}

function Page() {
    const t = useTranslations('Dashboard.item');

    return (
        <>
            <main className='tg-container'>
                <TGtitle title={t('redeem.title')} decs={t('redeem.decs')} />
                <Scanner />
            </main>
        </>
    )
}

export default Page