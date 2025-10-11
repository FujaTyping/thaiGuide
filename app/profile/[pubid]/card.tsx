/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import Atropos from 'atropos/react';
import { Coins } from 'lucide-react';
import Loader from '../../components/loader';
import { useTranslations } from 'next-intl';
import { motion } from "motion/react";
import NF from "@/assets/media/card/icon/notfound.svg";

function Card(user: any) {
    const t = useTranslations('Profile');

    if (!user) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        )
    }

    return (
        <>
            <Atropos className='my-8'>
                <div
                    className='relative overflow-hidden rounded-4xl'
                >
                    <img src={user.user.bg} className='w-full h-[400px] object-cover' alt="Card Background" />
                    <div className='absolute top-0 right-0 p-4 text-white'>
                        <p className='text-2xl font-semibold flex items-center gap-2'><Coins /> {user.user.point}</p>
                    </div>
                    <div className='absolute h-48 bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#f7740a]/70 to-transparent'></div>
                    <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white rounded-4xl'>
                        <div className='mb-6 flex flex-col gap-2'>
                            <img src={`${user.user.pfp}`} alt="Profile" className='w-28 rounded-full' />
                            <div>
                                <h1 className='text-3xl md:text-4xl font-bold mb-2'>{user.user.name}</h1>
                                <h2 className='font-semibold'>{t('cip')} : {user.user.checkin}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </Atropos>
            <div>
                <h1 className='font-bold text-2xl mt-1'>{t('badge.title')}</h1>
            </div>
            <div className='grid grid-cols-1 gap-4 mt-4'>
                {
                    user.user.badges.length == 0 ? <>
                        <div className='flex items-center flex-col justify-center py-8 gap-4'>
                            <motion.div
                                animate={{
                                    x: [0, -10, 10, -10, 10, -5, 5, 0],
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut"
                                }}
                            >
                                <img src={NF.src} alt="Icon" className='w-28 translate-x-3' />
                            </motion.div>
                            <p className='font-semibold'>{t('badge.no')}</p>
                        </div>
                    </> : <>
                        <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
                            {
                                user.user.badges.map((item: any, index: number) => (
                                    <div key={index} className='flex flex-col items-center justify-center'>
                                        <img src={item.imageUrl} alt='Badge' className='w-32 md:w-40' />
                                        <h2 className='font-semibold text-md md:text-lg mt-0.5'>{item.province.charAt(0).toUpperCase() + item.province.slice(1)}</h2>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default Card