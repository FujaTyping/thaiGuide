import React from 'react';
import fetchData from './fetch';
import NF from "@/assets/media/card/icon/notfound.svg";
import Loader from '@/app/components/loader';
import { ArrowRight, CalendarArrowUp, MapPin, Phone, Ticket, Map, Link as LLink } from 'lucide-react';
import type { Metadata } from "next";
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Didyouknow from "@/app/components/didyouknow";
import Thumnails from './thumnails';
import Sharebt from '@/app/components/sharebt';
import TGtitle from '@/app/components/tgtitle';
import ContentNotfound from '@/app/components/contentNotfound';
import Markdown from 'react-markdown';
import OSM from '@/app/components/OSM';

type Props = {
    params: Promise<{ resid: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { resid } = await params;
    const data = await fetchData(resid);

    const title = data && data !== "error" && data.name
        ? `ThaiGuide – ${data.name}`
        : "ThaiGuide – Event";

    return {
        title: title,
    };
}

async function page({ params }: Props) {
    const { resid } = await params;
    const data = await fetchData(resid) || "load";
    const t = await getTranslations('Event');

    const formatDate = (timestampSeconds: number): string => {
        const date = new Date(timestampSeconds * 1000);
        return `${String(date.getDate()).padStart(2, '0')} ${date.toLocaleString('en-US', { month: 'short', year: 'numeric' })}`;
    };

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
                <div className='grid grid-col-1 md:grid-cols-2 gap-8'>
                    <div>
                        <Thumnails image={data.image} />
                    </div>
                    <div>
                        <TGtitle title={data.title} />
                        <Link href={`/province/${data.province}`}>
                            <div className='flex flex-row md:items-center gap-1 md:gap-2 mt-3'>
                                <div className='flex items-center gap-2'>
                                    <MapPin className='font-semibold text-primary' />
                                    <h1 className='font-semibold'>{t('item.province')} : </h1>
                                </div>
                                <p>{data.province.charAt(0).toUpperCase() + data.province.slice(1)}</p>
                            </div>
                        </Link>
                        <p className='flex items-center gap-2 mt-2'><Ticket className='font-semibold text-primary' /> <span className='font-semibold'>{t('item.EvT')} :</span> {data.category.charAt(0).toUpperCase() + data.category.slice(1)}</p>
                        <p className='flex items-center gap-2 mt-2'><CalendarArrowUp className='font-semibold text-primary' /> <span className='font-semibold'>{t('item.date')} :</span> {formatDate(data.time.seconds)} - {formatDate(data.due.seconds)}</p>
                        <div className='mt-4'><Markdown>{data.decs}</Markdown></div>
                        {
                            data.details && <div className='grid grid-cols-2 md:grid-cols-3 py-8 gap-8'>
                                {
                                    data.details.tel && <div className='flex flex-col gap-1 items-center justify-center'>
                                        <Phone className='text-primary size-14' />
                                        <p className='font-semibold text-xl'>{data.details.tel.value}</p>
                                        <p>{t('item.call')}</p>
                                    </div>
                                }
                                {
                                    data.details.website && <>
                                        <Link href={data.details.website.value} className='flex flex-col gap-1 items-center justify-center'>
                                            <Map className='text-primary size-12' />
                                            <p className='font-semibold text-xl'>{t('item.click')}</p>
                                            <p>{t('item.web')}</p>
                                        </Link>
                                    </>
                                }
                                {
                                    data.details.link && <>
                                        <Link href={data.details.link.value} className='flex flex-col gap-1 items-center justify-center'>
                                            <LLink className='text-primary size-12' />
                                            <p className='font-semibold text-xl text-center'>{data.details.link.text}</p>
                                            <p>{data.details.link.type}</p>
                                        </Link>
                                    </>
                                }
                            </div>
                        }
                        <div>
                            <Link href={data.direction} className='bg-primary group w-full md:w-fit p-2 px-4 rounded-xl text-white mt-4 flex justify-center items-center gap-2'>
                                {t('item.map')}
                                <ArrowRight className='group-hover:translate-x-1 transition-all duration-200' />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <main className='max-w-7xl mx-auto px-4 pb-6'>
                <div>
                    <div className='mb-5'>
                        <h1 className='font-bold text-4xl'>{t('item.view')}</h1>
                        <div className='w-32 h-1.5 bg-primary mt-2'></div>
                    </div>
                    {
                        data.mapEmbed ? <>
                            <iframe src={data.mapEmbed} className='w-full h-[500px] rounded-2xl' loading="lazy"></iframe>
                        </> : <>
                            <OSM location={data.location} link={data.direction} name={data.title} address={data.addr} />
                        </>
                    }
                </div>
            </main>
            <Sharebt />

        </>
    )
}

export default page