import React from 'react'
import Didyouknow from '../components/didyouknow'
import { CircleStar, Megaphone, QrCode, ScanLine, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';
import TGtitle from '../components/tgtitle';

export const metadata: Metadata = {
    title: "ThaiGuide – Dashboard"
};

function Page() {
    const t = useTranslations('Dashboard');
    const menulist = [
        {
            label: t('grid.code'),
            icon: QrCode,
            link: "/dashboard/manage/qrcode",
            cat: t('manage')
        },
        {
            label: t('grid.reward'),
            icon: ScanLine,
            link: "/dashboard/redeem",
            cat: t('redeem')
        },
        {
            label: t('grid.badge'),
            icon: CircleStar,
            link: "/dashboard/manage/badge",
            cat: t('manage')
        },
        {
            label: t('grid.alert'),
            icon: Megaphone,
            link: "/dashboard/update/alert",
            cat: t('update')
        }
    ]

    return (
        <>
            <main className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} badge={t('beta')} />
                <p className='mt-3 font-bold flex items-center gap-2 text-primary'><TriangleAlert className='hidden md:block' />{t('noticelang')}</p>
            </main>
            <div className='max-w-7xl mx-auto px-4 pb-8'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {
                        menulist.map((items, index) => (
                            <Link href={items.link} key={index}>
                                <div className='cursor-pointer border-3 rounded-2xl border-primary p-4 px-5 flex flex-col items-center justify-center gap-2'>
                                    <items.icon className='w-10 h-10 text-primary' />
                                    <div className='text-center'>
                                        <h2 className='text-xl font-semibold'>{items.label}</h2>
                                        <p>{items.cat}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    }

                </div>
            </div>

        </>
    )
}

export default Page