import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

function Footer() {
    const t = useTranslations('FooterBar');
    return (
        <>
            <main className='bg-[#f7740a] py-3 border-t-2'>
                <div className="max-w-7xl mx-auto px-2 flex flex-col md:flex-row place-content-between gap-2 md:gap-0 items-start text-white">
                    <p>{t('title')}</p>
                    <p className='flex items-center gap-2'><Mail /> <Link href={"mailto:contact@siraphop.me"}>contact@siraphop.me</Link></p>
                </div>
            </main>
        </>
    )
}

export default Footer