import React from 'react';
import fetchData from './fetch';
import NF from "@/assets/media/card/icon/notfound.svg";
import Loader from '@/app/components/loader';
import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import Didyouknow from "@/app/components/didyouknow";
import Card from './card';

type Props = {
    params: Promise<{ pubid: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { pubid } = await params;
    const data = await fetchData(pubid);

    const firstName = data && data !== "error" && data.name ? data.name.split(' ')[0] : '';
    const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

    const name = data && data !== "error" && data.name
        ? `ThaiGuide – Traveler's ${capitalizedFirstName}`
        : "ThaiGuide – Traveler";

    return {
        title: name,
    };
}

async function page({ params }: Props) {
    const { pubid } = await params;
    const data = await fetchData(pubid) || "load";
    const t = await getTranslations('PublicProfile');

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
                <p className='font-semibold text-2xl'>{t('noneed')}</p>
            </div>
        </>)
    }

    const firstName = data && data !== "error" && data.name ? data.name.split(' ')[0] : '';
    const cardTitle = firstName ? `${firstName.charAt(0).toUpperCase() + firstName.slice(1)}'s ${t('tcard')}` : `${t('card')}`;

    return (
        <>
            <main className='tg-container'>
                <div>
                    <h1 className='font-bold text-4xl'>{cardTitle}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>{t('decs')}</p>
                <Card user={data} />
            </main>
            <Didyouknow />
        </>
    )
}

export default page