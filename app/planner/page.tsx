import React from 'react';
import type { Metadata } from "next";
import TInput from './input';
import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';
import Didyouknow from "@/app/components/didyouknow";

export const metadata: Metadata = {
    title: "ThaiGuide – Trip Planner"
};

function Page() {
    const t = useTranslations('Planner');

    return (
        <>
            <main className='tg-container'>
                <div>
                    <h1 className='font-bold text-4xl flex items-center gap-4'>{t('title')} <Badge className='text-white bg-primary'>{t('beta')}</Badge></h1>
                    <div className='w-32 h-1.5 bg-primary mt-2'></div>
                </div>
                <p className='mt-4 mb-3 sm:mb-0'>{t('decs')}</p>
                <TInput />
            </main>
            <Didyouknow />
        </>
    )
}

export default Page