"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Checkin from './checkin';
import Points from './points';
import { useTranslations } from 'next-intl';
import Confetti from 'react-confetti-boom';

function Main() {
    const t = useTranslations('leaderboard');

    return (
        <>
            <Confetti mode='fall' particleCount={8} fadeOutHeight={0.5} />
            <main className='tg-container'>
                <div>
                    <h1 className='font-bold text-4xl flex items-center gap-4'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-primary mt-2'></div>
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

export default Main