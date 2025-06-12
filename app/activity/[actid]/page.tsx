import React from 'react';
import fetchData from './fetch';
import NF from "@/assets/media/card/icon/notfound.png";
import Loader from '@/app/components/loader';
import { Banknote, Coins, MapPinned, Phone, Star, Map, CircleHelp } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from "next";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
    params: Promise<{ actid: string }>
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
                <p className='font-semibold text-2xl'>No activity data</p>
            </div>
        </>)
    }

    return (
        <>
            <div
                className='relative overflow-hidden rounded-b-4xl'
            >
                <img src={data.thumnails} className='w-full h-[550px] md:h-[650px] object-cover' alt={data.title} />
                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#f7740a]/70 to-transparent text-white rounded-b-4xl text-center'>
                    <h1 className='text-3xl md:text-4xl font-bold mb-2'>{data.ndtitle}</h1>
                </div>
            </div>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>{data.title}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>{data.decs}</p>
                <div className='grid grid-cols-2 md:grid-cols-3 py-8 gap-8'>
                    <div className='flex flex-col gap-1 items-center justify-center'>
                        <Banknote className='text-[#f7740a] size-14' />
                        <p className='font-semibold text-xl'>{data.pricing}</p>
                        <p>Average cost</p>
                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center'>
                        <Star className='text-[#f7740a] size-12' />
                        <p className='font-semibold text-xl'>{data.rating}</p>
                        <p>Rating</p>
                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center'>
                        <MapPinned className='text-[#f7740a] size-12' />
                        <p className='font-semibold text-xl'>{data.popular}</p>
                        <p>Best to visit</p>
                    </div>
                    {
                        data.details && (<>
                            <div className='flex flex-col gap-1 items-center justify-center'>
                                <Phone className='text-[#f7740a] size-12' />
                                <p className='font-semibold text-xl'>{data.details.tel}</p>
                                <p>Call</p>
                            </div>
                            <div className='flex flex-col gap-1 items-center justify-center'>
                                <Coins className='text-[#f7740a] size-12' />
                                <p className='font-semibold text-xl'>{data.details.points}</p>
                                <p className='flex items-center gap-2'>Point to recive
                                    <Tooltip>
                                        <TooltipTrigger><CircleHelp className='size-5 cursor-help' /></TooltipTrigger>
                                        <TooltipContent>
                                            <p>Scan a QR code at each tourist location to earn points.</p>
                                            <p>Collect points and redeem them for rewards.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </p>
                            </div>
                            {
                                data.details.website != "-" && <>
                                    <Link href={data.details.website} className='flex flex-col gap-1 items-center justify-center'>
                                        <Map className='text-[#f7740a] size-12' />
                                        <p className='font-semibold text-xl'>Click to open</p>
                                        <p>Website</p>
                                    </Link>
                                </>
                            }
                        </>)
                    }
                </div>
            </main>
            <main className='max-w-7xl mx-auto px-4 pb-6'>
                <div className='mb-5'>
                    <h1 className='font-bold text-4xl'>Local Weather Forecast</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <iframe src={`https://www.tmd.go.th/en/weatherForecast7DaysWidget?province=${data.province}`} height="400" className='w-full border-0' scrolling="no" title={`Weather forecast`}></iframe>
            </main>
            <main className='max-w-7xl mx-auto px-4 pb-6'>
                <div className='mb-5'>
                    <h1 className='font-bold text-4xl'>Map Location</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <iframe src={data.mapembed} className='w-full h-[500px] rounded-2xl' loading="lazy"></iframe>
            </main>
        </>
    )
}

export default page