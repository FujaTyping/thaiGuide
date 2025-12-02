import React from 'react';
import fetchData from './fetch';
import NF from "@/assets/media/card/icon/notfound.svg";
import Loader from '@/app/components/loader';
import { Banknote, Coins, MapPinned, Phone, Star, Map, CircleHelp, MapPin, Ticket, Smile } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from "next";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getTranslations } from 'next-intl/server';
import Sharebt from '@/app/components/sharebt';
import TGtitle from '@/app/components/tgtitle';
import ContentNotfound from '@/app/components/contentNotfound';
import Markdown from 'react-markdown';
import TSTV from './TSTV';
import OSM from './OSM';

type Props = {
    params: Promise<{ actid: string }>
}

interface ticketProp {
    title: string,
    price: string,
    for: string
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { actid } = await params;
    const data = await fetchData(actid);

    const title = data && data !== "error" && data.title
        ? `ThaiGuide – ${data.title}`
        : "ThaiGuide – Activity";

    return {
        title: title,
    };
}

async function page({ params }: Props) {
    const { actid } = await params;
    const data = await fetchData(actid) || "load";
    const t = await getTranslations('Activities');

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
                {data.tstv && <TSTV image={data.thumnails} />}
                <img src={data.thumnails} className={`${data.tstv && 'hidden sm:block'} w-full h-[550px] md:h-[700px] object-cover`} alt={data.title} />
                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-primary/70 to-transparent text-white rounded-b-4xl text-center'>
                    <h1 className='text-3xl md:text-4xl font-bold mb-2'>{data.ndtitle}</h1>
                </div>
            </div>
            <main className='tg-container'>
                <TGtitle title={data.title} />
                <Link href={`/province/${data.province}`} className='mt-3'>
                    <div className='flex flex-row md:items-center gap-1 md:gap-2 mt-3'>
                        <div className='flex items-center gap-2'>
                            <MapPin className='font-semibold text-primary' />
                            <h1 className='font-semibold'>{t('item.province')} : </h1>
                        </div>
                        <p>{data.province.charAt(0).toUpperCase() + data.province.slice(1)}</p>
                    </div>
                </Link>
                <div className='mt-2'><Markdown>{data.decs}</Markdown></div>
                <div className='grid grid-cols-2 md:grid-cols-3 py-8 gap-8'>
                    {
                        data.pricing && <div className='flex flex-col gap-1 items-center justify-center'>
                            <Banknote className='text-primary size-14' />
                            <p className='font-semibold text-xl'>{data.pricing}</p>
                            <p>{t('item.cost')}</p>
                        </div>
                    }
                    <div className='flex flex-col gap-1 items-center justify-center'>
                        <Star className='text-primary size-12' />
                        <p className='font-semibold text-xl'>{data.rating}</p>
                        <p>{t('item.rate')}</p>
                    </div>
                    {
                        data.popular && <div className='flex flex-col gap-1 items-center justify-center'>
                            <Smile className='text-primary size-12' />
                            <p className='font-semibold text-xl'>{data.popular}</p>
                            <p>{t('item.visit')}</p>
                        </div>
                    }
                    {
                        data.details && (<>
                            {
                                data.details.tel && <div className='flex flex-col gap-1 items-center justify-center'>
                                    <Phone className='text-primary size-12' />
                                    <p className='font-semibold text-xl'>{data.details.tel}</p>
                                    <p>{t('item.call')}</p>
                                </div>
                            }
                            <div className='flex flex-col gap-1 items-center justify-center'>
                                <Coins className='text-primary size-12' />
                                <p className='font-semibold text-xl'>{data.details.points}</p>
                                <p className='flex items-center gap-2'>{t('item.point')}
                                    <Tooltip>
                                        <TooltipTrigger><CircleHelp className='size-5 cursor-help' /></TooltipTrigger>
                                        <TooltipContent>
                                            <p>{t('item.infop.0')}</p>
                                            <p>{t('item.infop.1')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </p>
                            </div>
                            {
                                data.details.website && data.details.website != "-" && <>
                                    <Link href={data.details.website} className='flex flex-col gap-1 items-center justify-center'>
                                        <Map className='text-primary size-12' />
                                        <p className='font-semibold text-xl'>{t('item.click')}</p>
                                        <p>{t('item.web')}</p>
                                    </Link>
                                </>
                            }
                        </>)
                    }
                </div>
                {
                    data.haveticket && <>
                        <h1 className='text-2xl font-bold'>{t('item.hasticket')}</h1>
                        <div>
                            {
                                data.ticket.map((item: ticketProp, index: number) => (
                                    <div key={index} className={`flex items-start place-content-between ${index == data.ticket.length - 1 ? '' : 'border-b-1 border-primary'} py-4`}>
                                        <div className='flex items-start gap-4'>
                                            <div className='bg-primary p-3 rounded-full text-white'>
                                                <Ticket />
                                            </div>
                                            <div>
                                                <h2 className='font-semibold text-lg'>{item.title}</h2>
                                                <p className='text-sm md:text-base'>{t('item.for')} {item.for}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className='font-semibold text-lg'>{parseInt(item.price) <= 0 ? t('item.free') : `฿ ${item.price}`}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                }
            </main>
            <main className='max-w-7xl mx-auto px-4 pb-6'>
                <TGtitle second={true} title={t('item.forecast')} decs={t('item.weathersource')} />
                <iframe src={`https://www.tmd.go.th/en/weatherForecast7DaysWidget?province=${data.province}`} height="400" className='w-full border-0 mt-4' scrolling="no" title={`Weather forecast`}></iframe>
            </main>
            <main className='max-w-7xl mx-auto px-4 pb-6'>
                <TGtitle second={true} title={t('item.map')} />
                {
                    data.mapembed ? <iframe src={data.mapembed} className='w-full h-[500px] rounded-2xl' loading="lazy"></iframe> :
                        <>
                            <OSM location={data.maplocation} link={data.direction} address={data.location} name={data.title} />
                        </>
                }
            </main>
            <Sharebt />

        </>
    )
}

export default page