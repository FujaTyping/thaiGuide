"use client";

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight, CircleHelp, Coins, MapPin, Split } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from 'next-intl';
import { Map, Marker } from "pigeon-maps"
import PINS from "@/assets/media/map/pin.svg";
import TGtitle from '@/app/components/tgtitle';
import { getCenter } from "geolib"
import Link from 'next/link';
import { Map as MMAP } from "lucide-react";
import { useTheme } from 'next-themes';

interface Stop {
    name: string;
    location: string;
    decs: string;
    map: string;
    opt?: boolean;
    point: string;
    cord: {
        latitude: number,
        longitude: number
    }
    direction: string
}
interface TripStopsSwiperProps {
    stops: { [key: string]: Stop };
    overViewLink: string
}

const TripStopsSwiper: React.FC<TripStopsSwiperProps> = ({ stops, overViewLink }) => {
    const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const stopEntries = Object.entries(stops);
    const t = useTranslations('RoadTrip');

    if (!stopEntries || stopEntries.length === 0) {
        return <p className="text-center py-4 text-gray-600">{t('view.no')}</p>;
    }

    const stopCord = stopEntries.map(([, stopData]) => stopData.cord);
    const stopLink = stopEntries.map(([, stopData]) => stopData.direction);
    const overViewCenter: any = getCenter(stopCord);

    const { theme } = useTheme();
    const mapProvider = (x: number, y: number, z: number) => {
        if (theme == "dark") {
            return `https://a.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png`
        } else {
            return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
        }
    }

    return (
        <>
            <div className='mb-12'>
                <div className='mb-4 hidden md:flex items-center place-content-between'>
                    <p className='font-bold text-2xl md:text-3xl'>{t('view.stop')} {`(${activeIndex + 1}/${stopEntries.length})`}</p>
                    <div className='flex items-center gap-2'>
                        <div className='md:flex items-center justify-center hidden'>
                            <div
                                className='border-2 border-primary rounded-full p-2 hover:bg-primary flex items-center justify-center group transition-all duration-200 cursor-pointer'
                                onClick={() => swiperInstance?.slidePrev()}
                            >
                                <ChevronLeft className='text-primary group-hover:text-white' />
                            </div>
                        </div>
                        <div className='hidden md:flex items-center justify-center'>
                            <div
                                className='border-2 border-primary rounded-full p-2 hover:bg-primary flex items-center justify-center group transition-all duration-200 cursor-pointer'
                                onClick={() => swiperInstance?.slideNext()}
                            >
                                <ChevronRight className='text-primary group-hover:text-white' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='order-2 md:order-1 relative'>
                        <div className='absolute top-3 left-3 md:top-4 md:left-4 z-1 dark:bg-primary light:bg-white p-3 border-3 light:border-primary rounded-xl'>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={stopLink[activeIndex]}>
                                        <div className='text-primary dark:text-white flex flex-col items-center'>
                                            <Split className='w-8 h-8' />
                                            <h2 className='font-semibold text-sm'>{t('direction')}</h2>
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('directip')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Map provider={mapProvider} height={500} defaultCenter={[stopCord[0].latitude, stopCord[0].longitude]} center={[stopCord[activeIndex].latitude, stopCord[activeIndex].longitude]} defaultZoom={15} attribution={false}>
                            <Marker width={50} anchor={[stopCord[activeIndex].latitude, stopCord[activeIndex].longitude]} className='relative'>
                                <p className='absolute top-2.5 left-0 text-primary font-semibold text-sm text-center w-full'>{activeIndex + 1}</p>
                                <img src={PINS.src} alt="Icon" className='w-11' />
                            </Marker>
                        </Map>
                    </div>
                    <Swiper
                        spaceBetween={20}
                        onSwiper={setSwiperInstance}
                        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                        slidesPerView={1}
                        className='w-full order-1 md:order-2'
                    >
                        {stopEntries.map(([stopId, stopData]) => (
                            <SwiperSlide key={stopId} className="h-full">
                                <h1 className="text-2xl md:text-3xl font-semibold mb-2">{t('view.stopt')} {stopId}: {stopData.name} {stopData.opt ? '(Optional)' : ''}</h1>
                                <div className='flex flex-col md:flex-row md:items-center md:gap-2 py-2'>
                                    <div className='flex items-center gap-2'>
                                        <MapPin className='text-primary' /> <b>{t('view.location')}:</b>
                                    </div>
                                    <p>{stopData.location}</p>
                                </div>
                                {stopData.point && <div className='flex items-center gap-2 pb-2'>
                                    <div className='flex items-center gap-2'>
                                        <Coins className='text-primary' /> <b>{t('view.recived')}:</b>
                                    </div>
                                    <p>{stopData.point}</p>
                                    <Tooltip>
                                        <TooltipTrigger><CircleHelp className='size-5 cursor-help' /></TooltipTrigger>
                                        <TooltipContent>
                                            <p>{t('view.info.0')}</p>
                                            <p>{t('view.info.1')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>}
                                <p>{stopData.decs}</p>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className='grid md:hidden grid-cols-2 gap-3 mt-5'>
                    <div
                        className='border-2 border-primary rounded-xl p-2 hover:bg-primary flex items-center justify-center group transition-all duration-200 cursor-pointer'
                        onClick={() => swiperInstance?.slidePrev()}
                    >
                        <ChevronLeft className='text-primary group-hover:text-white' />
                    </div>
                    <div
                        className='border-2 border-primary rounded-xl p-2 hover:bg-primary flex items-center justify-center group transition-all duration-200 cursor-pointer'
                        onClick={() => swiperInstance?.slideNext()}
                    >
                        <ChevronRight className='text-primary group-hover:text-white' />
                    </div>
                </div>
            </div>
            <TGtitle second={true} title={t('view.overview')} />
            <div className='-mb-4 mt-6 relative'>
                <div className='absolute top-3 left-3 md:top-4 md:left-4 z-1 dark:bg-primary light:bg-white p-3 border-3 light:border-primary rounded-xl'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={overViewLink}>
                                <div className='text-primary dark:text-white flex flex-col items-center'>
                                    <MMAP className='w-8 h-8' />
                                    <h2 className='font-semibold text-sm'>{t('mapoverview')}</h2>
                                </div>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('directip')}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Map provider={mapProvider} height={500} defaultCenter={[overViewCenter.latitude, overViewCenter.longitude]} defaultZoom={11} attribution={false}>
                    {stopCord.map((data, index) => (
                        <Marker width={50} anchor={[data.latitude, data.longitude]} className='relative' key={index}>
                            <p className='absolute top-2.5 left-0 text-primary font-semibold text-sm text-center w-full'>{index + 1}</p>
                            <img src={PINS.src} alt="Icon" className='w-11' />
                        </Marker>
                    ))}
                </Map>
            </div>
        </>
    );
};

export default TripStopsSwiper;