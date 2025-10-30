"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import Loader from '@/app/components/loader';
import { server } from "@/app/config.json";
import { useTranslations } from 'next-intl';
import SwiperCore from 'swiper';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from "motion/react";
import TGtitle from '@/app/components/tgtitle';

interface Activity {
    name: string;
    id: string;
    title: string;
    ndtitle: string;
    location: string;
    decs: string;
    thumnails: string;
    pricing: string;
    rating: number;
    link: string;
}

interface ActivitiesProps {
    data: string;
}

function Activities({ data: provinceName }: ActivitiesProps) {
    const t = useTranslations('IndexAct');
    const [Data, setData] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const swiperRef = useRef<SwiperCore | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!provinceName) {
                setData([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await axios.put(
                    `${server}/activities/getbyprovince`,
                    { province: provinceName }
                );
                const fetchedActivities: Activity[] = response.data || [];

                if (fetchedActivities.length > 5) {
                    const shuffled = [...fetchedActivities].sort(() => 0.5 - Math.random());
                    setData(shuffled.slice(0, 5));
                } else {
                    setData(fetchedActivities.slice(0, 5));
                }
            } catch (err) {
                console.error("Error fetching activities:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [provinceName]);

    const goNext = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    const goPrev = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    return (
        <>
            <main className='tg-container'>
                <div className='flex items-center place-content-between mb-6'>
                    <TGtitle title={t('headder')} />
                    <div className='flex items-center gap-3'>
                        {Data.length > 1 && (
                            <>
                                <div
                                    className='border-2 border-primary rounded-full p-2 hover:bg-primary group transition-all duration-200 cursor-pointer'
                                    onClick={goPrev}
                                >
                                    <ChevronLeft className='text-primary group-hover:text-white' />
                                </div>
                                <div
                                    className='border-2 border-primary rounded-full p-2 hover:bg-primary group transition-all duration-200 cursor-pointer'
                                    onClick={goNext}
                                >
                                    <ChevronRight className='text-primary group-hover:text-white' />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {
                    loading ? (
                        <div className='w-full flex items-center justify-center my-12'>
                            <Loader />
                        </div>
                    ) : Data.length > 0 ? (
                        <>
                            <Swiper
                                spaceBetween={30}
                                slidesPerView={2}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 3,
                                        spaceBetween: 20,
                                    },
                                    768: {
                                        slidesPerView: 4,
                                        spaceBetween: 30,
                                    }
                                }}
                                onSwiper={(swiper) => swiperRef.current = swiper}
                            >
                                {
                                    Data.map((item) => (
                                        <SwiperSlide key={item.id} className='group'>
                                            <Link href={`/activity/${item.id}`}>
                                                <div
                                                    className="w-full h-[350px] md:h-[500px] rounded-4xl overflow-hidden relative"
                                                >
                                                    <Image width={1080} height={1280} className='w-full h-full object-cover' src={item.thumnails} alt={`${item.title}`} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent"></div>
                                                </div>
                                                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white rounded-b-4xl'>
                                                    <h1 className='text-2xl md:text-3xl font-bold pb-3 md:pb-0 group-hover:-translate-y-4 transition-all duration-200'>{item.ndtitle}</h1>
                                                </div>
                                            </Link>
                                        </SwiperSlide>
                                    ))
                                }
                                <SwiperSlide>
                                    <Link href={"/activity"}>
                                        <motion.div
                                            whileTap={{ scale: 0.95 }}
                                            className='flex items-center justify-center flex-col h-[350px] gap-4 md:h-[500px] bg-primary text-white rounded-4xl'
                                        >
                                            <div className='p-3 border-2 rounded-full'>
                                                <Leaf className='w-10 h-10' />
                                            </div>
                                            <div className='flex flex-col items-center justify-center px-2 text-center'>
                                                <h1 className='font-semibold text-2xl mb-1'>{t('more.title')}</h1>
                                                <p className='max-w-[90%] text-center'>{t('more.decs')}</p>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </SwiperSlide>
                            </Swiper>
                        </>
                    ) : (
                        <div className='w-full flex items-center justify-center my-12'>
                            <p>{t('no')}</p>
                        </div>
                    )
                }
            </main >
        </>
    )
}

export default Activities;