import React from 'react';
import type { Metadata } from "next";
import Grid from './grid';
import { Flame, Leaf, UtensilsCrossed } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "ThaiGuide – Restaurant and Food"
};

function Page() {
    const t = useTranslations('Restaurant');

    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>{t('decs')}</p>
                <Grid />
            </main>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('tips.title')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
                    <div className='border-3 rounded-xl p-4 border-[#f7740a]'>
                        <h1 className='text-xl font-semibold mb-2 flex items-center gap-2'><Flame className='text-[#f7740a]' /> {t('tips.0.title')}</h1>
                        <p>{t('tips.0.decs')}</p>
                    </div>
                    <div className='border-3 rounded-xl p-4 border-[#f7740a]'>
                        <h1 className='text-xl font-semibold mb-2 flex items-center gap-2'><Leaf className='text-[#f7740a]' /> {t('tips.1.title')}</h1>
                        <p>{t('tips.1.decs')}</p>
                    </div>
                    <div className='border-3 rounded-xl p-4 border-[#f7740a] md:col-span-2'>
                        <h1 className='text-xl font-semibold mb-2 flex items-center gap-2'><UtensilsCrossed className='text-[#f7740a]' /> {t('tips.2.title')}</h1>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <h1 className='text-lg font-semibold mb-1'>{t('tips.2.0.title')}</h1>
                                <div className='ml-4'>
                                    <li>{t('tips.2.0.0')}</li>
                                    <li>{t('tips.2.0.1')}</li>
                                    <li>{t('tips.2.0.2')}</li>
                                    <li>{t('tips.2.0.3')}</li>
                                    <li>{t('tips.2.0.4')}</li>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-lg font-semibold mb-1'>{t('tips.2.1.title')}</h1>
                                <div className='ml-4'>
                                    <li>{t('tips.2.1.0')}</li>
                                    <li>{t('tips.2.1.1')}</li>
                                    <li>{t('tips.2.1.2')}</li>
                                    <li>{t('tips.2.1.3')}</li>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Page