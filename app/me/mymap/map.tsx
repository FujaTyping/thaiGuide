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
//import FP from "@/assets/media/map/found.svg";
import { Milestone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface mislocation {
    latitude: number;
    longitude: number;
}

function PMap() {
    const t = useTranslations('Mymap');
    const [user, setUser] = useState<User | null>(null);
    const [center, setCenter] = useState<[number, number]>([13.740545687328561, 100.5328534229996]);
    const [zoom, setZoom] = useState(6);
    const [data, setData] = useState<mislocation[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                try {
                    const res = await axios.get(`https://${server}/code/randommap`);
                    const datt = res.data;
                    const cenall: any = getCenter(res.data);
                    setCenter([cenall.latitude, cenall.longitude]);
                    setZoom(12);
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
                        data.map((item, index: number) => (
                            <Overlay key={index} anchor={[item.latitude, item.longitude]} offset={[42, 50]}>
                                <Popover>
                                    <PopoverTrigger>
                                        <img src={MIS.src} className='w-14 cursor-pointer' alt='Icon' onClick={() => { setCenter([item.latitude, item.longitude]); setZoom(13); }} />
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
                </Map>
            </div>
        </>
    )
}

export default PMap