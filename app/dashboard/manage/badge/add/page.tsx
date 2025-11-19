import TGtitle from '@/app/components/tgtitle'
import React from 'react'
import type { Metadata } from "next"
import FForm from './form'
import { useTranslations } from 'next-intl'

export const metadata: Metadata = {
    title: 'ThaiGuide – Add New Badge'
}

function page() {
    const t = useTranslations('Dashboard.item.badge.form');

    return (
        <>
            <section className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} />
                <div className='mt-5'>
                    <FForm />
                </div>
            </section>
        </>
    )
}

export default page