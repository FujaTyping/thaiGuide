"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import Loader from '../components/loader';
import axios from 'axios';
import { server } from "@/app/config.json";
import { useTranslations } from 'next-intl';
import { motion } from "motion/react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import NF from "@/assets/media/card/icon/notfound.svg";
import { Footprints, Quote } from 'lucide-react';

interface BBBadge {
    imageUrl: string,
    province: string,
    slogan: string,
    recivedAt: {
        seconds: number;
    }
}

function BBadge() {
    const t = useTranslations('Profile');
    const [user, setUser] = useState<User | null>(null);
    const [badgee, setBadgee] = useState<BBBadge[] | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                try {
                    const checkUser = await axios.put(`https://${server}/badge/getbyuser`, {
                        userid: user.uid
                    })
                    setBadgee(checkUser.data.badges);
                } catch {
                    setBadgee([]);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!user || !badgee) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        )
    }

    return (
        <>
            <div className='grid grid-cols-1 gap-4 mt-4'>
                {
                    badgee.length == 0 ? <>
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
                                badgee.map((item, index) => (
                                    <div key={index} className='flex flex-col items-center justify-center'>
                                        <motion.div
                                            whileHover={{ scale: 1.08 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Popover>
                                                <PopoverTrigger>
                                                    <img src={item.imageUrl} alt='Badge' className='w-32 md:w-40 cursor-pointer' />
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <h1 className='flex items-center gap-2'><b className='flex items-center gap-1'><Footprints className='text-primary' /> {t('badge.visit')} :</b> {item.province.charAt(0).toUpperCase() + item.province.slice(1)}</h1>
                                                    <h2 className='mt-1'><b className='flex items-center gap-1'><Quote className='text-primary' /> {t('badge.slogan')} : </b> {item.slogan}</h2>
                                                </PopoverContent>
                                            </Popover>
                                        </motion.div>
                                        <h2 className='font-semibold text-md md:text-lg mt-0.5'>{item.province.charAt(0).toUpperCase() + item.province.slice(1)}</h2>
                                        <p className='text-sm md:text-base'>{new Date(item.recivedAt.seconds * 1000).toLocaleDateString()}</p>
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

export default BBadge