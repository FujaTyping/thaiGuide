"use client";

import React, { useState, useEffect } from 'react';

import { MapPin } from 'lucide-react';
import axios from "axios";
import Loader from '@/app/components/loader';
import { server } from "@/app/config.json";
import Link from 'next/link';
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface RoadtripItem {
    id: string;
    title: string;
    thumnails: string;
    location: string;
    tags: string[];
}

function Roadtrip() {
    const t = useTranslations('IndexTrip');
    const [Data, setData] = useState<RoadtripItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${server}/roadtrip`);
                const fetchedRoadtrips: RoadtripItem[] = response.data || [];

                if (fetchedRoadtrips.length > 3) {
                    const shuffled = [...fetchedRoadtrips].sort(() => 0.5 - Math.random());
                    setData(shuffled.slice(0, 3));
                } else {
                    setData(fetchedRoadtrips);
                }
            } catch (err) {
                console.error("Error fetching roadtrip:", err);
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
                </div>
                {
                    loading ? <>
                        <div className='w-full flex items-center justify-center my-12'>
                            <Loader />
                        </div>
                    </> : <>
                        <div className='grid grid-cols-1 gap-6'>
                            {
                                Data.map((item, index) => (
                                    <Link href={`roadtrip/${item.id}`} key={index}>
                                        <motion.div
                                            whileHover={{ scale: 1.05, rotate: -1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <div className='relative'>
                                                <div
                                                    className="w-full h-[120px] md:h-[150px] rounded-2xl overflow-hidden relative"
                                                >
                                                    <Image width={1280} height={720} className='w-full h-full object-cover' src={item.thumnails} alt={item.title} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent"></div>
                                                </div>
                                                <div className='absolute left-0 right-0 top-1/2 -translate-y-1/2 p-4 md:p-8 text-white rounded-4xl text-center'>
                                                    <h1 className='text-2xl md:text-3xl font-bold pb-0 md:pb-1'>{item.title}</h1>
                                                    <p className='mt-1 hidden md:flex gap-2 items-center justify-center'><MapPin /> {item.location}</p>
                                                    <div className='flex items-center justify-center gap-2 mt-2'>
                                                        {
                                                            item.tags.map((tag, index) => (
                                                                <Badge key={index} className='bg-white text-black'>{tag}</Badge>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))
                            }
                        </div>
                    </>}
            </main>
        </>
    )
}

export default Roadtrip