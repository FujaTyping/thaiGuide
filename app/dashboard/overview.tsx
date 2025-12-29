"use client"

import React, { useState, useEffect } from 'react'
import tgFetch from '@/lib/fetch'
import { server } from "@/app/config.json"
import Loader from '../components/loader';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BusFront, TentTree, UsersRound, Utensils } from 'lucide-react';
import CountUp from '@/components/bits/CountUp.tsx/CountUp';
import { Autoplay } from 'swiper/modules';
import { useTranslations } from 'next-intl';

interface overviewValue {
    activities: number;
    restaurant: number;
    roadtrip: number;
    Users: number
}

function Overview() {
    const t = useTranslations('Dashboard.overview');
    const [data, setData] = useState<overviewValue | null>(null);

    useEffect(() => {
        async function getdatt() {
            const fetchData = await tgFetch({ url: `${server}/dashboard/overview` });
            setData(fetchData.data);
        }
        getdatt();
    }, [])

    function GenerateCard({ name, decs, Dicon, value }: { name: string, decs: string, Dicon: React.ElementType, value: number }) {
        return (
            <div className='flex flex-row items-start justify-between gap-3'>
                <Dicon className="text-primary w-10 h-10" />
                <div className='text-right'>
                    <div>
                        <h2 className='font-semibold text-lg'>{name}</h2>
                        <p className='text-sm -mt-1'>{decs}</p>
                    </div>
                    <CountUp to={value} className='text-primary font-bold text-2xl' />
                </div>
            </div>
        )
    }

    if (!data) return (
        <div className='w-full flex items-center justify-center my-6'>
            <Loader />
        </div>
    )

    return (
        <>
            <Swiper
                slidesPerView={2}
                spaceBetween={30}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    }
                }}
                autoplay={{
                    delay: 7500,
                }}
                modules={[Autoplay]}
                className='border-3 rounded-2xl border-primary'
            >
                <SwiperSlide className='px-5 py-5'><GenerateCard name={t('act')} decs={t('item')} Dicon={TentTree} value={data.activities} /></SwiperSlide>
                <SwiperSlide className='px-5 py-5'><GenerateCard name={t('res')} decs={t('item')} Dicon={Utensils} value={data.restaurant} /></SwiperSlide>
                <SwiperSlide className='px-5 py-5'><GenerateCard name={t('rt')} decs={t('item')} Dicon={BusFront} value={data.roadtrip} /></SwiperSlide>
                <SwiperSlide className='px-5 py-5'><GenerateCard name={t('usr')} decs={t('item')} Dicon={UsersRound} value={data.Users} /></SwiperSlide>
            </Swiper>
        </>

    )
}

export default Overview