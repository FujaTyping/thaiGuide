"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from "@/app/config.json";
import Loader from '../components/loader';
import R1 from "@/assets/media/icon/Rank1.svg";
import R2 from "@/assets/media/icon/Rank2.svg";
import R3 from "@/assets/media/icon/Rank3.svg";
import { Flame } from 'lucide-react';
import { useTranslations } from 'next-intl';
import anno from "@/assets/media/icon/ano.svg";
import { motion } from "motion/react";
import NF from "@/assets/media/card/icon/notfound.svg";
import Link from 'next/link';

interface dataTypes {
    name: string;
    checkin: number;
    pfp: string;
    id: string
}

function Checkin() {
    const t = useTranslations('leaderboard');
    const [data, setData] = useState<dataTypes[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://${server}/leaderboard/getbycheckin`);
                setData(response.data);
            } catch (err) {
                console.error("Error fetching :", err);
                setData([]);
            }
        };
        fetchData();
    }, []);

    if (data.length === 0) return (
        <div className='w-full flex items-center justify-center my-12'>
            <Loader />
        </div>
    )

    if (data.length < 5) return (
        <div className='flex items-center flex-col justify-center gap-4 mt-5'>
            <motion.div
                animate={{
                    x: [0, -10, 10, -10, 10, -5, 5, 0],
                }}
                transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                }}
            >
                <img src={NF.src} alt="Not Found" className='w-32 ml-5' />
            </motion.div>
            <p className='font-semibold'>{t('noneed')}</p>
        </div>
    )

    return (
        <>
            <>
                <p className='flex items-center gap-2 py-2 text-lg text-primary font-semibold'><Flame /> {t('board.mcn.header')}</p>
                <div className='flex flex-col gap-16 md:grid grid-cols-3 md:gap-6 mt-14'>
                    {
                        data.map((item, index) => (
                            <div key={index}>
                                {
                                    index < 3 && <>
                                        <Link href={`/traveler/${item.id}`}>
                                            <div className={`relative flex flex-col items-end py-3 md:py-6 gap-1 h-full ${index < 3 ? "bg-primary text-white" : ""}   rounded-md p-3 text-lg`}>
                                                <img src={item.pfp || anno.src} alt="Profile" className='w-24 md:w-28 absolute left-0 top-0 -mt-12 border-6 border-primary rounded-full' />
                                                {index === 0 && <img src={R1.src} alt="Rank 1" className='w-14 absolute right-0 top-0 -mt-5' />}
                                                {index === 1 && <img src={R2.src} alt="Rank 2" className='w-14 absolute right-0 top-0 -mt-5' />}
                                                {index === 2 && <img src={R3.src} alt="Rank 3" className='w-14 absolute right-0 top-0 -mt-5' />}
                                                <div className='flex flex-col items-end mt-7 md:mt-10 lg:mt-4'>
                                                    <p className='font-semibold text-2xl text-right'>{item.name}</p>
                                                    <p>{item.checkin} {t('board.mcn.pts')}</p>
                                                    <p className='text-right'>{t(`board.mcn.msg.${index}`)}</p>
                                                </div>
                                                <p className="[writing-mode:sideways-lr] absolute left-0 bottom-0 p-2 pb-4 font-semibold">{t('board.mcn.top')} #{index + 1}</p>
                                            </div>
                                        </Link>
                                    </>
                                }
                            </div>
                        ))
                    }
                </div>
                <p className='-mt-40 md:-mt-0 text-lg'>{t('board.mcn.other')}</p>
                <div className='flex flex-col gap-5 -mt-11'>
                    {
                        data.map((item, index) => (
                            <div key={index}>
                                {
                                    index > 2 && <>
                                        <Link href={`/traveler/${item.id}`}>
                                            <div className={`flex items-center place-content-between ${index < 3 ? "bg-primary text-white" : ""}   rounded-md text-lg`}>
                                                <div className='flex items-center gap-2 font-semibold'>
                                                    <p>#{index + 1}</p>
                                                    <p>{item.name}</p>
                                                </div>
                                                <p>{item.checkin} {t('board.mcn.pts')}</p>
                                            </div>
                                        </Link>
                                    </>
                                }
                            </div>
                        ))
                    }
                </div>
            </>
        </>
    )
}

export default Checkin