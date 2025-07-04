import React from 'react';
import fetchData from './fetch';
import NF from "@/assets/media/card/icon/notfound.svg";
import Loader from '@/app/components/loader';
import { MapPin, Clock } from 'lucide-react';
import type { Metadata } from "next";
import TripStopsSwiper from './swipez';
import { Badge } from "@/components/ui/badge";
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Didyouknow from "@/app/components/didyouknow";

type Props = {
    params: Promise<{ tripid: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { tripid } = await params;
    const data = await fetchData(tripid);

    const title = data && data !== "error" && data.title
        ? `ThaiGuide – ${data.title}`
        : "ThaiGuide – Roadtrip";

    return {
        title: title,
    };
}

async function page({ params }: Props) {
    const { tripid } = await params;
    const data = await fetchData(tripid) || "load";
    const t = await getTranslations('RoadTrip');

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
                <p className='font-semibold text-2xl'>{t('nnotfound')}</p>
            </div>
        </>)
    }

    return (
        <>
            <div
                className='relative overflow-hidden rounded-b-4xl'
            >
                <img src={data.thumnails} className='w-full h-[550px] md:h-[700px] object-cover' alt={data.title} />
                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#f7740a]/70 to-transparent text-white rounded-b-4xl text-center'>
                    <h1 className='text-3xl md:text-4xl font-bold mb-2'>{data.ndtitle}</h1>
                </div>
            </div>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>{data.title}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <div className='flex flex-col md:flex-row md:items-center gap-3 mt-4'>
                    <div className='flex items-center gap-1'>
                        <MapPin className='text-[#f7740a]' />
                        <p><b>{t('view.start')}:</b> {data.start}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <MapPin className='text-[#f7740a]' />
                        <p><b>{t('view.end')}:</b> {data.end}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Clock className='text-[#f7740a]' />
                        <p>{data.long}</p>
                    </div>
                </div>
                <Link href={`/province/${data.province}`}>
                    <div className='flex flex-row md:items-center gap-1 md:gap-2 mt-3'>
                        <div className='flex items-center gap-2'>
                            <MapPin className='font-semibold text-[#f7740a]' />
                            <h1 className='font-semibold'>{t('province')} : </h1>
                        </div>
                        <p>{data.province.charAt(0).toUpperCase() + data.province.slice(1)}</p>
                    </div>
                </Link>
                <p className='mt-2'>{data.decs}</p>
                <div className='flex items-center gap-2 mt-2 mb-10'>
                    {
                        data.tags.map((tag: string, index: number) => (
                            <Badge key={index} className='bg-[#f7740a] text-white'>{tag}</Badge>
                        ))
                    }
                </div>
                <TripStopsSwiper stops={data.stops} />
            </main>
            <main className='max-w-7xl mx-auto px-4 pb-6'>
                <div className='mb-5'>
                    <h1 className='font-bold text-4xl'>{t('view.overview')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <iframe src={data.map} className='w-full h-[500px] rounded-2xl' loading="lazy"></iframe>
            </main>
            <Didyouknow />
        </>
    )
}

export default page