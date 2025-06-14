import React from 'react';
import type { Metadata } from "next";
import TInput from './input';
import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "ThaiGuide – Trip Planner"
};

function Page() {
    const t = useTranslations('Planner');

    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl flex items-center gap-4'>{t('title')} <Badge className='text-white bg-[#f7740a]'>{t('beta')}</Badge></h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>{t('decs')}</p>
                <TInput />
            </main>
        </>
    )
}

export default Page