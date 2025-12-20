import TGtitle from '@/app/components/tgtitle'
import React from 'react'
import Content from './content'
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: "ThaiGuide – Activities Management"
};

function Page() {
  const t = useTranslations('Dashboard.item.activities');

  return (
    <>
      <section className='tg-container'>
        <TGtitle title={t('title')} decs={t('decs')} />
      </section>
      <section className='max-w-7xl mx-auto px-4 pb-6'>
        <Content />
      </section>
    </>
  )
}

export default Page