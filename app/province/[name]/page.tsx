/* eslint-disable  @typescript-eslint/no-explicit-any */
import React from 'react';
import fetchData from './fetch';
import NF from "@/assets/media/card/icon/notfound.svg";
import Loader from '@/app/components/loader';
import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { MapPin, Quote } from 'lucide-react';
import Activities from './activities';
import Quiz from './quiz';
import TGtitle from '@/app/components/tgtitle';

type Props = {
    params: Promise<{ name: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { name } = await params;
    const data = await fetchData(name);

    const title = data && data !== "error" && data.name
        ? `ThaiGuide – ${data.name}`
        : "ThaiGuide – Province";

    return {
        title: title,
    };
}

async function page({ params }: Props) {
    const { name } = await params;
    const data = await fetchData(name) || "load";
    const t = await getTranslations('Provincess');

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
                <p className='font-semibold text-2xl'>{t('item.notfound')}</p>
            </div>
        </>)
    }

    return (
        <>
            <div
                className='relative overflow-hidden rounded-b-4xl'
            >
                <img src={data.thumbnails} className='w-full h-[550px] md:h-[700px] object-cover' alt={data.name} />
                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-primary/70 to-transparent text-white rounded-b-4xl text-center'>
                    <h1 className='text-3xl md:text-4xl font-bold mb-2'>{data.ndtitle}</h1>
                </div>
            </div>
            <main className='tg-container'>
                <TGtitle title={data.name} />
                <p className='mt-3 font-semibold flex items-center gap-2'><MapPin className='text-primary' /> {data.location}</p>
                <p className='mt-2'>{data.decs}</p>
                <div className='flex items-center gap-2 mt-6'>
                    <Quote className='text-primary' />
                    <h1 className='font-semibold'>{t('item.slogan')}</h1>
                </div>
                <p className='mt-1'>{data.slogan}</p>
            </main>
            <main className='tg-container'>
                <TGtitle title={t('item.softhight')} />
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-6'>
                    {
                        data.softpower.map((item: any, index: number) => (
                            <div key={index} className='group'>
                                <div className="h-62 w-full overflow-hidden rounded-xl">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className='w-full h-full object-cover group-hover:scale-110 transition-all duration-200'
                                    />
                                </div>
                                <div className='mt-4'>
                                    <h1 className='font-semibold text-xl mb-1'>{item.name}</h1>
                                    <p>{item.decs}</p>
                                    <p className='flex flex-col mt-2'><span className='flex items-center font-semibold mb-1 gap-1'>
                                        <MapPin className='text-primary' /> {t('item.location')}</span>
                                        {item.location}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </main>
            <Activities data={data.name.toLowerCase()} />
            <Quiz data={data.name.toLowerCase()} />
        </>
    )
}

export default page