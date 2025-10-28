"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Quiz from './quiz';
import BBadge from './badge';
import Details from './details';
import { useTranslations } from 'next-intl';
import CustomizeBG from './customize/backgroud';

function Main() {
    const t = useTranslations('Profile');
    const [editpfp, setEditPFP] = useState(false);
    const [activeTab, setActiveTab] = useState("tsn");
    const [activeCUSTab, setActiveCUSTab] = useState("bgg");

    return (
        <>
            <p className='mb-6 mt-4 font-semibold text-center'>{t('shareTitleM')} {t('customize.or')} <span onClick={() => setEditPFP(!editpfp)} className='text-primary cursor-pointer'>{editpfp ? `${t('customize.bgO')}` : `${t('customize.bgOF')}`}</span></p>
            {
                editpfp ?
                    <Tabs value={activeCUSTab} onValueChange={setActiveCUSTab} id='cus' defaultValue="bgg" className='w-full'>
                        <TabsList className='w-full'>
                            <TabsTrigger value="bgg" className='cursor-pointer'>{t('customize.bg')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="bgg">
                            <div>
                                <h1 className='font-bold text-2xl mt-1'>{t('customize.bg')}</h1>
                            </div>
                            <CustomizeBG />
                        </TabsContent>
                    </Tabs>
                    : <Tabs id='pro' value={activeTab} onValueChange={setActiveTab} className='w-full'>
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
            }
        </>
    )
}

export default Main