import React from 'react';
import type { Metadata } from "next";
import IssuesForm from './issuesForm';
import { useTranslations } from 'next-intl';
import { Info } from 'lucide-react';
import Link from 'next/link';
import FeedbackBoard from './feedbackBoard';
import TGtitle from '../components/tgtitle';

export const metadata: Metadata = {
  title: "ThaiGuide – Feedback and Issues"
};

function Page() {
  const t = useTranslations('Feedback');

  return (
    <>
      <main className='tg-container'>
        <TGtitle title={t('title')} decs={t('decs')} />
        <IssuesForm />
        <TGtitle title={t('pptitle')} decs={t('ppdecs')} />
        <FeedbackBoard />
        <div className='flex items-center justify-center'>
          <Link href={"https://tally.so/r/n9PZyp"} className='mt-2 text-primary flex items-center gap-2 cursor-pointer font-semibold' ><Info /> {t('tally')}</Link>
        </div>
      </main>
    </>
  )
}

export default Page