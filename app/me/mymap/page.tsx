import Didyouknow from '@/app/components/didyouknow';
import React from 'react';
import type { Metadata } from "next";
import PMap from './map';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: "ThaiGuide – My Map"
};


function Page() {
  const t = useTranslations('Mymap');

  return (
    <>
      <main className='max-w-7xl mx-auto px-4 pt-6'>
        <div>
          <h1 className='font-bold text-4xl'>{t('title')}</h1>
          <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
        </div>
        <p className='mt-4'>{t('decs')}</p>
      </main>
      <PMap />
      <Didyouknow />
    </>
  )
}

export default Page