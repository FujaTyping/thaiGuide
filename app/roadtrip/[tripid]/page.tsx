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
import Sharebt from '@/app/components/sharebt';
import TGtitle from '@/app/components/tgtitle';
import ContentNotfound from '@/app/components/contentNotfound';
import Markdown from 'react-markdown';

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
        return <ContentNotfound />
    }

    return (
        <>
            <div
                className='relative overflow-hidden rounded-b-4xl'
            >
                <img src={data.thumnails} className='w-full h-[550px] md:h-[700px] object-cover' alt={data.title} />
                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-primary/70 to-transparent text-white rounded-b-4xl text-center'>
                    <h1 className='text-3xl md:text-4xl font-bold mb-2'>{data.ndtitle}</h1>
                </div>
            </div>
            <main className='tg-container'>
                <TGtitle title={data.title} />
                <div className='flex flex-col md:flex-row md:items-center gap-3 mt-4'>
                    <div className='flex items-center gap-1'>
                        <MapPin className='text-primary' />
                        <p><b>{t('view.start')}:</b> {data.start}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <MapPin className='text-primary' />
                        <p><b>{t('view.end')}:</b> {data.end}</p>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Clock className='text-primary' />
                        <p>{data.long}</p>
                    </div>
                </div>
                <Link href={`/province/${data.province}`}>
                    <div className='flex flex-row md:items-center gap-1 md:gap-2 mt-3'>
                        <div className='flex items-center gap-2'>
                            <MapPin className='font-semibold text-primary' />
                            <h1 className='font-semibold'>{t('province')} : </h1>
                        </div>
                        <p>{data.province.charAt(0).toUpperCase() + data.province.slice(1)}</p>
                    </div>
                </Link>
                <p className='mt-2'><Markdown>{data.decs}</Markdown></p>
                <div className='flex items-center gap-2 mt-2 mb-10'>
                    {
                        data.tags.map((tag: string, index: number) => (
                            <Badge key={index} className='bg-primary text-white'>{tag}</Badge>
                        ))
                    }
                </div>
                <TripStopsSwiper stops={data.stops} />
            </main>
            <main className='max-w-7xl mx-auto px-4 pb-6'>
                <TGtitle second={true} title={t('view.overview')} />
                <iframe src={data.map} className='w-full h-[500px] rounded-2xl' loading="lazy"></iframe>
            </main>
            <Sharebt />

        </>
    )
}

export default page