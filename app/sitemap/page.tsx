import React from 'react'
import TGtitle from '../components/tgtitle'
import { links } from "./page.json";
import Link from 'next/link';
import type { Metadata } from "next";
import List from './list';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "ThaiGuide – Sitemap"
};

function Page() {
    const t = useTranslations("Sitemap");

    return (
        <>
            <div className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} />
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4'>
                    {
                        links.map((item, key) => (
                            <div key={key} className='flex items-center justify-center text-center'>
                                <Link href={item.link}>
                                    <h1 className='text-primary font-bold text-lg'>{t(`links.${item.title}`)}</h1>
                                </Link>
                            </div>
                        ))
                    }
                </div>
                <List />
            </div>
        </>
    )
}

export default Page