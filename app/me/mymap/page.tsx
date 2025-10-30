import Didyouknow from '@/app/components/didyouknow';
import React from 'react';
import type { Metadata } from "next";
import PMap from './map';
import { useTranslations } from 'next-intl';
import TGtitle from '@/app/components/tgtitle';

export const metadata: Metadata = {
  title: "ThaiGuide – My Map"
};


function Page() {
  const t = useTranslations('Mymap');

  return (
    <>
      <main className='max-w-7xl mx-auto px-4 pt-6'>
        <TGtitle title={t('title')} decs={t('decs')} />
      </main>
      <PMap />
      
    </>
  )
}

export default Page