"use client";

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight, CircleHelp, Coins, MapPin } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from 'next-intl';

interface Stop {
    name: string;
    location: string;
    decs: string;
    map: string;
    opt?: boolean;
    point: string;
}
interface TripStopsSwiperProps {
    stops: { [key: string]: Stop };
}

const TripStopsSwiper: React.FC<TripStopsSwiperProps> = ({ stops }) => {
    const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const stopEntries = Object.entries(stops);
    const t = useTranslations('RoadTrip');

    if (!stopEntries || stopEntries.length === 0) {
        return <p className="text-center py-4 text-gray-600">{t('view.no')}</p>;
    }

    return (
        <div>
            <div className='mb-4 hidden md:flex items-center place-content-between'>
                <p className='font-bold text-2xl md:text-3xl'>{t('view.stop')} {`(${activeIndex + 1}/${stopEntries.length})`}</p>
                <div className='flex items-center gap-2'>
                    <div className='md:flex items-center justify-center hidden'>
                        <div
                            className='border-2 border-[#f7740a] rounded-full p-2 hover:bg-[#f7740a] flex items-center justify-center group transition-all duration-200 cursor-pointer'
                            onClick={() => swiperInstance?.slidePrev()}
                        >
                            <ChevronLeft className='text-[#f7740a] group-hover:text-white' />
                        </div>
                    </div>
                    <div className='hidden md:flex items-center justify-center'>
                        <div
                            className='border-2 border-[#f7740a] rounded-full p-2 hover:bg-[#f7740a] flex items-center justify-center group transition-all duration-200 cursor-pointer'
                            onClick={() => swiperInstance?.slideNext()}
                        >
                            <ChevronRight className='text-[#f7740a] group-hover:text-white' />
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex w-full place-content-between gap-6'>
                <Swiper
                    spaceBetween={20}
                    onSwiper={setSwiperInstance}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    slidesPerView={1}
                    className='col-span-6'
                >
                    {stopEntries.map(([stopId, stopData]) => (
                        <SwiperSlide key={stopId} className="h-full">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
                                <iframe src={stopData.map} className='w-full h-[500px] rounded-2xl col-span-2 order-2 md:order-1' loading="lazy"></iframe>
                                <div className='col-span-2 order-1 md:order-2'>
                                    <h1 className="text-2xl md:text-3xl font-semibold mb-2">{t('view.stopt')} {stopId}: {stopData.name} {stopData.opt ? '(Optional)' : ''}</h1>
                                    <div className='flex flex-col md:flex-row md:items-center md:gap-2 py-2'>
                                        <div className='flex items-center gap-2'>
                                            <MapPin className='text-[#f7740a]' /> <b>{t('view.location')}:</b>
                                        </div>
                                        <p>{stopData.location}</p>
                                    </div>
                                    <div className='flex items-center gap-2 pb-2'>
                                        <div className='flex items-center gap-2'>
                                            <Coins className='text-[#f7740a]' /> <b>{t('view.recived')}:</b>
                                        </div>
                                        <p>{stopData.point}</p>
                                        <Tooltip>
                                            <TooltipTrigger><CircleHelp className='size-5 cursor-help' /></TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t('view.info.0')}</p>
                                                <p>{t('view.info.1')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <p>{stopData.decs}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className='grid md:hidden grid-cols-2 gap-3 mt-5'>
                <div
                    className='border-2 border-[#f7740a] rounded-xl p-2 hover:bg-[#f7740a] flex items-center justify-center group transition-all duration-200 cursor-pointer'
                    onClick={() => swiperInstance?.slidePrev()}
                >
                    <ChevronLeft className='text-[#f7740a] group-hover:text-white' />
                </div>
                <div
                    className='border-2 border-[#f7740a] rounded-xl p-2 hover:bg-[#f7740a] flex items-center justify-center group transition-all duration-200 cursor-pointer'
                    onClick={() => swiperInstance?.slideNext()}
                >
                    <ChevronRight className='text-[#f7740a] group-hover:text-white' />
                </div>
            </div>
        </div>
    );
};

export default TripStopsSwiper;