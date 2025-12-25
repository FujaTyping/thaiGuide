"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Star, Wallet } from 'lucide-react';
import Link from 'next/link';
import Loader from '@/app/components/loader';
import { server } from "@/app/config.json";
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Swiper, SwiperSlide } from "swiper/react";
import tgFetch from '@/lib/fetch';

interface Activity {
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

function Activities() {
    const t = useTranslations('IndexAct');
    const [Data, setData] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const mainSwiper = useRef<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await tgFetch({
                    url: `${server}/activities`, data: {
                        params: {
                            limit: 7
                        }
                    },
                    cache: true
                })
                const fetchedActivities: Activity[] = response.data || [];
                setData(fetchedActivities);
            } catch (err) {
                console.error("Error fetching activities:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <main className='max-w-7xl mx-auto px-3 py-6'>
                <div className='flex items-center place-content-between mb-6'>
                    <h1 className='text-2xl md:text-3xl font-bold text-primary dark:text-white'>{t('headder')}</h1>
                    <div className='flex items-center gap-3'>
                        {Data.length > 1 && (
                            <>
                                <div
                                    onClick={() => mainSwiper.current?.slidePrev()}
                                    className='border-2 border-primary rounded-full p-2 hover:bg-primary group transition-all duration-200 cursor-pointer'
                                >
                                    <ChevronLeft className='text-primary group-hover:text-white' />
                                </div>
                                <div
                                    onClick={() => mainSwiper.current?.slideNext()}
                                    className='border-2 border-primary rounded-full p-2 hover:bg-primary group transition-all duration-200 cursor-pointer'
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
                    ) : Data.length > 0 && (
                        <>
                            <Swiper
                                loop={true}
                                onSwiper={(swiper) => mainSwiper.current = swiper}
                                spaceBetween={80}
                            >
                                {
                                    Data.map((item, index) => (<SwiperSlide key={index}>
                                        <div
                                            className='grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-8 py-1 md:py-2'
                                        >
                                            <div
                                                className='relative md:col-span-2'
                                            >
                                                <motion.div
                                                    whileHover={{ rotateY: -15, rotateX: -5 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className='relative md:col-span-2'
                                                >
                                                    <Link href={`/activity/${item.id}`}>
                                                        <div className='h-[300px] md:h-[460px] w-full'>
                                                            <Image
                                                                src={item.thumnails}
                                                                alt={item.title}
                                                                className='rounded-4xl object-cover'
                                                                fill
                                                            />
                                                            <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-primary/70 to-transparent text-white rounded-b-4xl'>
                                                                <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-2'>{item.title}</h1>
                                                                <p className='text-xs md:text-sm'>{item.location}</p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            </div>
                                            <div className='flex flex-col place-content-between py-4 md:py-0'>
                                                <div>
                                                    <h2 className='font-semibold text-xl md:text-2xl mb-2'>{item.ndtitle}</h2>
                                                    <p className='text-sm md:text-base'>{item.decs}</p>
                                                </div>
                                                <div className='grid grid-cols-2 gap-4 mt-4 md:mt-0'>
                                                    {item.pricing && <div className='flex items-center gap-2 text-sm md:text-base'>
                                                        <Wallet size={20} />
                                                        {item.pricing}
                                                    </div>}
                                                    <div className='flex items-center gap-2 text-sm md:text-base'>
                                                        <Star size={20} />
                                                        {item.rating}
                                                    </div>
                                                </div>
                                            </div>
                                        </div></SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </>
                    )
                }
            </main>
        </>
    )
}

export default Activities;