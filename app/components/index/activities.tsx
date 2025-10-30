"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Star, Wallet } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import Loader from '@/app/components/loader';
import { server } from "@/app/config.json";
import { useTranslations } from 'next-intl';
import Image from 'next/image';

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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${server}/activities`);
                const fetchedActivities: Activity[] = response.data || [];

                if (fetchedActivities.length > 5) {
                    const shuffled = [...fetchedActivities].sort(() => 0.5 - Math.random());
                    setData(shuffled.slice(0, 5));
                } else {
                    setData(fetchedActivities);
                }
            } catch (err) {
                console.error("Error fetching activities:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? Data.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === Data.length - 1 ? 0 : prevIndex + 1));
    };

    const currentActivity = Data[currentIndex];

    return (
        <>
            <main className='max-w-7xl mx-auto px-3 py-6'>
                <div className='flex items-center place-content-between mb-6'>
                    <h1 className='text-2xl md:text-3xl font-bold text-primary'>{t('headder')}</h1>
                    <div className='flex items-center gap-3'>
                        {Data.length > 1 && (
                            <>
                                <div
                                    className='border-2 border-primary rounded-full p-2 hover:bg-primary group transition-all duration-200 cursor-pointer'
                                    onClick={handlePrev}
                                >
                                    <ChevronLeft className='text-primary group-hover:text-white' />
                                </div>
                                <div
                                    className='border-2 border-primary rounded-full p-2 hover:bg-primary group transition-all duration-200 cursor-pointer'
                                    onClick={handleNext}
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
                    ) : Data.length > 0 && currentActivity && (
                        <>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.2 }}
                                    className='grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-8'
                                >
                                    <motion.div
                                        whileHover={{ rotateY: -15, rotateX: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        className='relative md:col-span-2'
                                    >
                                        <Link href={`/activity/${currentActivity.id}`}>
                                            <div>
                                                <Image
                                                    src={currentActivity.thumnails}
                                                    alt={currentActivity.title}
                                                    className='rounded-4xl h-[300px] md:h-[460px] w-full object-cover'
                                                    height={1000}
                                                    width={1280}
                                                />
                                                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-primary/70 to-transparent text-white rounded-b-4xl'>
                                                    <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-2'>{currentActivity.title}</h1>
                                                    <p className='text-xs md:text-sm'>{currentActivity.location}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                    <div className='flex flex-col place-content-between py-4 md:py-0'>
                                        <div>
                                            <h2 className='font-semibold text-xl md:text-2xl mb-2'>{currentActivity.ndtitle}</h2>
                                            <p className='text-sm md:text-base'>{currentActivity.decs}</p>
                                        </div>
                                        <div className='grid grid-cols-2 gap-4 mt-4 md:mt-0'>
                                            <div className='flex items-center gap-2 text-sm md:text-base'>
                                                <Wallet size={20} />
                                                {currentActivity.pricing}
                                            </div>
                                            <div className='flex items-center gap-2 text-sm md:text-base'>
                                                <Star size={20} />
                                                {currentActivity.rating}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </>
                    )
                }
            </main>
        </>
    )
}

export default Activities;