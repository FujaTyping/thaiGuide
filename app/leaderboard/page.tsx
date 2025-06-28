import React from 'react';
import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Checkin from './checkin';
import Points from './points';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: "ThaiGuide – Leaderboard"
};

function Page() {
    const t = useTranslations('leaderboard');

    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl flex items-center gap-4'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-3'>{t('decs')}</p>
                <Tabs defaultValue="pt" className="w-full mt-4">
                    <TabsList className='w-full'>
                        <TabsTrigger value="pt" className='cursor-pointer'>{t('ms')}</TabsTrigger>
                        <TabsTrigger value="cn" className='cursor-pointer'>{t('mcn')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pt"><Points /></TabsContent>
                    <TabsContent value="cn"><Checkin /></TabsContent>
                </Tabs>
            </main>
        </>
    )
}

export default Page