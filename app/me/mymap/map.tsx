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
import CountUp from '@/components/bits/CountUp.tsx/CountUp';

// Map Pin
import MIS from "@/assets/media/map/mystery.svg";
import FP from "@/assets/media/map/found.svg";
import MPIN from "@/assets/media/map/pinman.svg";

import { CalendarCheck2, EyeClosed, LockOpen, MapPinHouse, Milestone, Telescope, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface MyLoca {
    latitude: number;
    longitude: number;
}

function PMap() {
    const t = useTranslations('Mymap');
    const [user, setUser] = useState<User | null>(null);
    const [center, setCenter] = useState<[number, number]>([13.740545687328561, 100.5328534229996]);
    const [zoom, setZoom] = useState(6);
    const [manLO, setManLo] = useState<MyLoca>();
    const [data, setData] = useState<any>();
    const [lockMap, setLockMap] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                try {
                    const res = await axios.put(`${server}/code/mapbyid`, {}, {
                        headers: {
                            aetheruid: user.uid
                        }
                    });
                    const datt = res.data;
                    setData(datt);
                } catch {
                    setUser(null);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        function getLocation() {
            if (!lockMap) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setCenter([position.coords.latitude, position.coords.longitude]);
                        setZoom(16);
                        setManLo({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    }
                );
            }
        }

        if ('geolocation' in navigator) {
            getLocation()
            intervalId = setInterval(() => getLocation(), 2500);
        }
        return () => clearInterval(intervalId);
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
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-5'>
                    <div className='border-3 border-primary rounded-2xl p-4 px-5 flex items-start gap-6'>
                        <div>
                            <Telescope className='w-8 h-8 text-primary' />
                        </div>
                        <div>
                            <h2 className='font-bold text-xl'>{t('visited.gtitle')}</h2>
                            <p>{t('visited.gdecs')}</p>
                            <h2 className='font-semibold text-lg'><span className='text-xl font-bold'>
                                <CountUp
                                    from={0}
                                    to={data.visited.length}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text"
                                />
                            </span> {t('place')}</h2>
                        </div>
                    </div>
                    <div className='border-3 border-primary rounded-2xl p-4 px-5 flex items-start gap-6'>
                        <div>
                            <EyeClosed className='w-8 h-8 text-primary' />
                        </div>
                        <div>
                            <h2 className='font-bold text-xl'>{t('unseen.gtitle')}</h2>
                            <p>{t('unseen.gdecs')}</p>
                            <h2 className='font-semibold text-lg'><span className='text-xl font-bold'>
                                <CountUp
                                    from={0}
                                    to={data.undiscover.length}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text"
                                />
                            </span> {t('place')}</h2>
                        </div>
                    </div>
                </div>
                <div className='relative'>
                    <div className='absolute bottom-4 right-4 z-1 flex items-center gap-3'>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button className='cursor-pointer' onClick={() => setLockMap(!lockMap)}>{lockMap ? <LockOpen /> : <Lock />}</Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('mapLock')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <Map attribution={false} height={600} center={center} zoom={zoom}>
                        {
                            data.undiscover.map((item: any, index: number) => (
                                <Overlay className='z-1' key={index} anchor={[item.latitude, item.longitude]} offset={[40, 35]}>
                                    <Popover>
                                        <PopoverTrigger>
                                            <img src={MIS.src} className='w-10 cursor-pointer z-1' alt='Icon' onClick={() => { setCenter([item.latitude, item.longitude]); setZoom(14); }} />
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <h1 className='text-lg font-bold'>{t('unseen.title')}</h1>
                                            <p>{t('unseen.decs')}</p>
                                            {/*<p className='flex items-center gap-2 mt-2'><Coins /> 0</p>*/}
                                            <Link href={`https://www.google.com/maps/place/${item.latitude},${item.longitude}`}><Button className='w-full mt-3 cursor-pointer bg-primary hover:bg-primary'><Milestone /> {t('unseen.di')}</Button></Link>
                                        </PopoverContent>
                                    </Popover>
                                </Overlay>
                            ))
                        }
                        {
                            data.visited.map((item: any, index: number) => (
                                <Overlay className='z-1' key={index} anchor={[item.latitude, item.longitude]} offset={[34, 20]}>
                                    <Popover>
                                        <PopoverTrigger>
                                            <img src={FP.src} className='w-7 cursor-pointer z-2' alt='Icon' onClick={() => { setCenter([item.latitude, item.longitude]); setZoom(15); }} />
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <h1 className='text-lg font-bold'>{t('visited.title')}</h1>
                                            <div className='space-y-2 md:space-y-1 mt-1'>
                                                <p className='flex md:items-center flex-col md:flex-row gap-2'><span className='font-semibold flex items-center gap-2'><MapPinHouse className='text-primary' /> {t('visited.name')} :</span> {item.name}</p>
                                                <p className='flex items-center gap-2'><span className='font-semibold flex items-center gap-2'><CalendarCheck2 className='text-primary' /> {t('visited.year')} :</span> {item.year}</p>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </Overlay>
                            ))
                        }
                        {
                            manLO && (
                                <Overlay anchor={[manLO?.latitude, manLO?.longitude]} offset={[34, 50]} className='z-0'>
                                    <img src={MPIN.src} className='w-7 z-0' alt='Icon' />
                                </Overlay>
                            )
                        }
                    </Map>
                </div>
            </div>
        </>
    )
}

export default PMap