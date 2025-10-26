import React from 'react'
import Didyouknow from '../components/didyouknow'
import { QrCode, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "ThaiGuide – Dashboard"
};

function Page() {
    const t = useTranslations('Dashboard');

    return (
        <>
            <main className='tg-container'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>
                    {t('decs')}
                </p>
                <p className='mt-3 font-bold flex items-center gap-2 text-[#f7740a]'><TriangleAlert className='hidden md:block' />{t('noticelang')}</p>
            </main>
            <div className='max-w-7xl mx-auto px-4 pb-8'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <Link href={'/dashboard/manage/qrcode'}>
                        <div className='cursor-pointer border-3 rounded-2xl border-[#f7740a] p-4 px-5 flex flex-col items-center justify-center gap-2'>
                            <QrCode className='w-10 h-10 text-[#f7740a]' />
                            <div className='text-center'>
                                <h2 className='text-xl font-semibold'>{t('grid.code')}</h2>
                                <p>{t('manage')}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
            <Didyouknow />
        </>
    )
}

export default Page