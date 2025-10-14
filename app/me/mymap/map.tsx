/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { Map, Overlay } from "pigeon-maps";
import Loader from '@/app/components/loader';
import { onAuthStateChanged, User } from 'firebase/auth';
import auth from '@/lib/firebaseAuth';
import axios from 'axios';
import { server } from "@/app/config.json";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import getCenter from 'geolib/es/getCenter';

// Map Pin
import MIS from "@/assets/media/map/mystery.svg";
import FP from "@/assets/media/map/found.svg";

import { CalendarCheck2, MapPinHouse, Milestone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

function PMap() {
    const t = useTranslations('Mymap');
    const [user, setUser] = useState<User | null>(null);
    const [center, setCenter] = useState<[number, number]>([13.740545687328561, 100.5328534229996]);
    const [zoom, setZoom] = useState(6);
    const [data, setData] = useState<any>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                try {
                    const res = await axios.put(`https://${server}/code/mapbyid`, { uid: user.uid });
                    const datt = res.data;
                    const cenall: any = getCenter(res.data.undiscover);
                    setCenter([cenall.latitude, cenall.longitude]);
                    setZoom(6);
                    setData(datt);
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!user || !data) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        )
    }

    return (
        <>
            <div className='max-w-7xl mx-auto px-4 py-7'>
                <Map attribution={false} height={600} center={center} zoom={zoom}>
                    {
                        data.undiscover.map((item: any, index: number) => (
                            <Overlay key={index} anchor={[item.latitude, item.longitude]} offset={[42, 50]}>
                                <Popover>
                                    <PopoverTrigger>
                                        <img src={MIS.src} className='w-14 cursor-pointer' alt='Icon' onClick={() => { setCenter([item.latitude, item.longitude]); setZoom(14); }} />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <h1 className='text-lg font-bold'>{t('unseen.title')}</h1>
                                        <p>{t('unseen.decs')}</p>
                                        {/*<p className='flex items-center gap-2 mt-2'><Coins /> 0</p>*/}
                                        <Link href={`https://www.google.com/maps/place/${item.latitude},${item.longitude}`}><Button className='w-full mt-3 cursor-pointer bg-[#f7740a] hover:bg-[#f7740a]'><Milestone /> {t('unseen.di')}</Button></Link>
                                    </PopoverContent>
                                </Popover>
                            </Overlay>
                        ))
                    }
                    {
                        data.visited.map((item: any, index: number) => (
                            <Overlay key={index} anchor={[item.latitude, item.longitude]} offset={[40, 35]}>
                                <Popover>
                                    <PopoverTrigger>
                                        <img src={FP.src} className='w-10 cursor-pointer' alt='Icon' onClick={() => { setCenter([item.latitude, item.longitude]); setZoom(15); }} />
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <h1 className='text-lg font-bold'>{t('visited.title')}</h1>
                                        <div className='space-y-2 md:space-y-1 mt-1'>
                                            <p className='flex md:items-center flex-col md:flex-row gap-2'><span className='font-semibold flex items-center gap-2'><MapPinHouse className='text-[#f7740a]' /> {t('visited.name')} :</span> {item.name}</p>
                                            <p className='flex md:items-center flex-col md:flex-row gap-2'><span className='font-semibold flex items-center gap-2'><CalendarCheck2 className='text-[#f7740a]' /> {t('visited.year')} :</span> {item.year}</p>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </Overlay>
                        ))
                    }
                </Map>
            </div>
        </>
    )
}

export default PMap