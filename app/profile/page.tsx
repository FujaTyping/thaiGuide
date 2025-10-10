import React from 'react';
import Card from './card';
import Details from './details';
import Qr from './qr';
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';
import Didyouknow from "@/app/components/didyouknow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Quiz from './quiz';
import BBadge from './badge';

export const metadata: Metadata = {
    title: "ThaiGuide – My Profile"
};

function Page() {
    const t = useTranslations('Profile');

    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>{t('decs')}</p>
                <Card />
                <Tabs defaultValue="tsn" className='w-full'>
                    <TabsList className='w-full'>
                        <TabsTrigger value="tsn" className='cursor-pointer'>{t('transaction.title')}</TabsTrigger>
                        <TabsTrigger value="bdg" className='cursor-pointer'>{t('badge.section')}</TabsTrigger>
                        <TabsTrigger value="qz" className='cursor-pointer'>{t('quiz.title')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tsn">
                        <div>
                            <h1 className='font-bold text-2xl mt-1'>{t('transaction.title')}</h1>
                        </div>
                        <Details />
                    </TabsContent>
                    <TabsContent value="bdg">
                        <div>
                            <h1 className='font-bold text-2xl mt-1'>{t('badge.title')}</h1>
                        </div>
                        <BBadge />
                    </TabsContent>
                    <TabsContent value="qz">
                        <div>
                            <h1 className='font-bold text-2xl mt-1'>{t('quiz.realtitle')}</h1>
                        </div>
                        <Quiz />
                    </TabsContent>
                </Tabs>
            </main>
            <Qr />
            <Didyouknow />
        </>
    )
}

export default Page