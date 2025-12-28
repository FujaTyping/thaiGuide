import React from 'react'
import Didyouknow from '../components/didyouknow'
import { CircleStar, Megaphone, PartyPopper, QrCode, ScanLine, TentTree, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';
import TGtitle from '../components/tgtitle';
import Overview from './overview';

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
        },
        {
            label: t('grid.reward'),
            icon: PartyPopper,
            link: "/dashboard/manage/reward",
            cat: t('manage')
        },
        {
            label: t('grid.activities'),
            icon: TentTree,
            link: "/dashboard/manage/activities",
            cat: t('manage')
        }
    ]

    return (
        <>
            <main className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} badge={t('beta')} />
                <div className='py-6'>
                    <h1 className='text-2xl font-bold text-primary pb-3'>{t('statics')}</h1>
                    <Overview />
                </div>
                <div>
                    <h1 className='text-2xl font-bold text-primary pb-3'>{t('menu')}</h1>
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
            </main>
        </>
    )
}

export default Page