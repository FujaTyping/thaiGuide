import React from 'react';
import type { Metadata } from "next";
import IssuesForm from './issuesForm';
import { useTranslations } from 'next-intl';
import { Info } from 'lucide-react';

export const metadata: Metadata = {
  title: "ThaiGuide – Feedback and Issues"
};

function Page() {
  const t = useTranslations('Feedback');

  return (
    <>
      <main className='max-w-7xl mx-auto px-4 py-6'>
        <div>
          <h1 className='font-bold text-4xl flex items-center gap-4'>{t('title')}</h1>
          <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
        </div>
        <p className='mt-4'>{t('decs')}</p>
        <IssuesForm />
        <div className='flex items-center justify-center'>
          <button data-tally-open="n9PZyp" data-tally-emoji-text="🙏🏻" data-tally-emoji-animation="wave" className='mt-2 text-[#f7740a] flex items-center gap-2 cursor-pointer font-semibold' ><Info /> {t('tally')}</button>
        </div>
      </main>
    </>
  )
}

export default Page