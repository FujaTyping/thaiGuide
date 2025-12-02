"use client";

import React from 'react'
import { Map, Marker } from "pigeon-maps"
import PINS from "@/assets/media/map/pin.svg";
import { Split } from 'lucide-react';
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip";
import { useTranslations } from 'next-intl';

function OSM({ location, link, address, name }: { location: { latitude: number, longitude: number }, link: string, address: string, name: string }) {
    const t = useTranslations('Activities');

    return (
        <>
            <div className='relative flex flex-col-reverse gap-4'>
                <div className='md:absolute z-1 top-4 left-4 bg-white p-3 px-4 rounded-xl border-3 border-primary flex items-start place-content-between gap-6'>
                    <div>
                        <h1 className='font-bold text-lg'>{name}</h1>
                        <p className='max-w-xs text-sm mt-1'>{address}</p>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={link}>
                                <div className='text-primary flex flex-col items-center'>
                                    <Split className='w-8 h-8' />
                                    <h2 className='font-semibold text-sm'>{t('item.osm.direction')}</h2>
                                </div>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('item.osm.directip')}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Map height={500} defaultCenter={[location.latitude, location.longitude]} defaultZoom={14} attribution={false}>
                    <Marker width={50} anchor={[location.latitude, location.longitude]}>
                        <img src={PINS.src} alt="Icon" className='w-11' />
                    </Marker>
                </Map>
            </div>
        </>
    )
}

export default OSM