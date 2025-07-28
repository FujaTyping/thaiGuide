import React from 'react';
import fetchData from './fetch';
import NF from "@/assets/media/card/icon/notfound.svg";
import Loader from '@/app/components/loader';
import { ArrowRight, Banknote, MapPin, MapPinned, Sparkle, Star } from 'lucide-react';
import type { Metadata } from "next";
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Didyouknow from "@/app/components/didyouknow";
import Thumnails from './thumnails';
import Sharebt from '@/app/components/sharebt';

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
        : "ThaiGuide – Restaurant";

    return {
        title: title,
    };
}

async function page({ params }: Props) {
    const { resid } = await params;
    const data = await fetchData(resid) || "load";
    const t = await getTranslations('Restaurant');

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
                <img src={data.image} className='w-full h-[550px] md:h-[700px] object-cover' alt={data.name} />
                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#f7740a]/70 to-transparent text-white rounded-b-4xl text-center'>
                    <h1 className='text-3xl md:text-4xl font-bold mb-2'>{data.ndname}</h1>
                </div>
            </div>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>{data.name}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mt-3'>
                    <div className='flex items-center gap-2'>
                        <MapPin className='font-semibold text-[#f7740a]' />
                        <h1 className='font-semibold'>{t('item.location')} : </h1>
                    </div>
                    <p>{data.location}</p>
                </div>
                <Link href={`/province/${data.province}`}>
                    <div className='flex flex-row md:items-center gap-1 md:gap-2 mt-3'>
                        <div className='flex items-center gap-2'>
                            <MapPin className='font-semibold text-[#f7740a]' />
                            <h1 className='font-semibold'>{t('item.province')} : </h1>
                        </div>
                        <p>{data.province.charAt(0).toUpperCase() + data.province.slice(1)}</p>
                    </div>
                </Link>
                <p className='mt-4'>{data.decs}</p>
                <div className='grid grid-cols-2 md:grid-cols-3 py-8 gap-8'>
                    <div className='flex flex-col gap-1 items-center justify-center'>
                        <Banknote className='text-[#f7740a] size-14' />
                        <p className='font-semibold text-xl'>{data.price}</p>
                        <p>{t('item.cost')}</p>
                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center'>
                        <Star className='text-[#f7740a] size-12' />
                        <p className='font-semibold text-xl'>{data.rating}</p>
                        <p>{t('item.rate')}</p>
                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center'>
                        <MapPinned className='text-[#f7740a] size-12' />
                        <p className='font-semibold text-xl'>{data.details.openhour}</p>
                        <p>{t('item.open')}</p>
                    </div>
                </div>
                <h1 className='text-2xl font-bold'>{t('item.highlight')}</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mt-4'>
                    <div>
                        <Thumnails image={data.thumnails} />
                    </div>
                    <div className='flex flex-col gap-1 mt-3'>
                        {
                            data.dish.map((item: string, index: number) => (
                                <div key={index} className='flex items-center gap-2'>
                                    <Sparkle className='text-[#f7740a]' />
                                    <p className='text-lg'>{item}</p>
                                </div>
                            ))
                        }
                        <Link href={data.link} className='bg-[#f7740a] group w-full md:w-fit p-2 px-4 rounded-xl text-white mt-4 flex justify-center items-center gap-2'>
                            {t('item.map')}
                            <ArrowRight className='group-hover:translate-x-1 transition-all duration-200' />
                        </Link>
                    </div>
                </div>
            </main>
            <main className='max-w-7xl mx-auto px-4 pb-6'>
                <div className='mb-5'>
                    <h1 className='font-bold text-4xl'>{t('item.view')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                {
                    data.streetview != "" ? <>
                        <iframe src={data.streetview} className='w-full h-[500px] rounded-2xl' loading="lazy"></iframe>
                    </> : <>
                        <div className='flex items-center flex-col justify-center gap-4 py-8'>
                            <img src={NF.src} alt="Icon" className='w-28 translate-x-3' />
                            <p className='font-semibold text-2xl'>{t('item.noview')}</p>
                        </div>
                    </>
                }
            </main>
            <Sharebt />
            <Didyouknow />
        </>
    )
}

export default page