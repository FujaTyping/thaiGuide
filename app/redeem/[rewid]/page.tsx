import React from 'react';
import fetchData from './fetch';
import NF from "@/assets/media/card/icon/notfound.svg";
import Loader from '@/app/components/loader';
import type { Metadata } from "next";
import Details from './details';
import { getTranslations } from 'next-intl/server';
import Didyouknow from "@/app/components/didyouknow";
import TGtitle from '@/app/components/tgtitle';
import ContentNotfound from '@/app/components/contentNotfound';

type Props = {
    params: Promise<{ rewid: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { rewid } = await params;
    const data = await fetchData(rewid);

    const title = data && data !== "error" && data.name
        ? `ThaiGuide – Redeem ${data.name}`
        : "ThaiGuide – Reward";

    return {
        title: title,
    };
}

async function Page({ params }: Props) {
    const { rewid } = await params;
    const data = await fetchData(rewid) || "load";
    const t = await getTranslations('Redeem');

    if (data == "load") {
        return (<>
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        </>)
    }

    if (data == "error") {
        return <ContentNotfound />
    }

    return (
        <>
            <main className='tg-container'>
                <TGtitle title={t('items.title')} decs={t('items.decs')} />
                <Details data={data} />
            </main>
            
        </>
    )
}

export default Page