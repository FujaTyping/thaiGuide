import React from 'react';
import fetchData from './fetch';
import NF from "@/assets/media/card/icon/notfound.png";
import Loader from '@/app/components/loader';
import type { Metadata } from "next";
import Details from './details';
import { getTranslations } from 'next-intl/server';

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
        return (<>
            <div className='flex items-center flex-col justify-center gap-4 py-8'>
                <img src={NF.src} alt="Icon" className='w-32 translate-x-3' />
                <p className='font-semibold text-2xl'>{t('items.notfound')}</p>
            </div>
        </>)
    }

    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('items.title')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-3'>{t('items.decs')}</p>
                <Details data={data} />
            </main>
        </>
    )
}

export default Page