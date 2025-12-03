"use client";

import React from 'react'
import { Map, Marker } from "pigeon-maps"
import PINS from "@/assets/media/map/pin.svg";
import { Split } from 'lucide-react';
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip";
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

function OSM({ location, link, address, name }: { location: { latitude: number, longitude: number }, link: string, address: string, name: string }) {
    const t = useTranslations('Activities');
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
            <div className='relative flex flex-col-reverse gap-4'>
                <div className='md:absolute z-1 top-4 left-4 dark:bg-primary light:bg-white p-3 px-4 rounded-xl border-3 light:border-primary flex items-start place-content-between gap-6'>
                    <div>
                        <h1 className='font-bold text-lg max-w-sm'>{name}</h1>
                        <p className='max-w-xs text-sm mt-1'>{address}</p>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={link}>
                                <div className='text-primary dark:text-white flex flex-col items-center'>
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
                <Map provider={mapProvider} height={500} defaultCenter={[location.latitude, location.longitude]} defaultZoom={14} attribution={false}>
                    <Marker width={50} anchor={[location.latitude, location.longitude]}>
                        <img src={PINS.src} alt="Icon" className='w-11' />
                    </Marker>
                </Map>
            </div>
        </>
    )
}

export default OSM