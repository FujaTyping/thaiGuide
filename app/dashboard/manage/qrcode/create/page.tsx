import React from 'react';
import type { Metadata } from "next";
import NewForm from './form';
import { useTranslations } from 'next-intl';
import TGtitle from '@/app/components/tgtitle';

export const metadata: Metadata = {
    title: "ThaiGuide – Create new Qr Code"
};

function Page() {
    const t = useTranslations('Dashboard.item.qrcode.create');

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