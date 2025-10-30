import { CalendarDays } from 'lucide-react';
import React from 'react';
import type { Metadata } from "next";
import Didyouknow from '../components/didyouknow';
import { useTranslations } from 'next-intl';
import TGtitle from '../components/tgtitle';

export const metadata: Metadata = {
    title: "ThaiGuide – Privacy Policy"
};

function Page() {
    const t = useTranslations('PP');

    return (
        <>
            <main className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} />
                <h2 className='font-semibold mt-2 flex items-center gap-2'><CalendarDays size={20} className='text-primary' /> {t('date')} : 10/13/25</h2>
                <div className='mt-6'>
                    <h3 className="text-xl font-semibold mt-4 mb-2">1. {t('content.1.title')}</h3>
                    <p>
                        {t('content.1.decs')}
                    </p>
                    <h3 className="text-xl font-semibold mt-4 mb-2">2. {t('content.2.title')}</h3>
                    <p>
                        {t('content.2.decs')}
                    </p>
                    <h3 className="text-xl font-semibold mt-4 mb-2">3. {t('content.3.title')}</h3>
                    <p>
                        {t('content.3.decs')}
                    </p>
                    <h3 className="text-xl font-semibold mt-4 mb-2">4. {t('content.4.title')}</h3>
                    <p>
                        {t('content.4.decs')}
                    </p>
                    <h3 className="text-xl font-semibold mt-4 mb-2">5. {t('content.5.title')}</h3>
                    <p>
                        {t('content.5.decs')}
                    </p>
                </div>
            </main>
            
        </>
    )
}

export default Page