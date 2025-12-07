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
import { ChevronDown, Footprints, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const INITIAL_ITEMS_TO_SHOW = 8;
const ITEMS_PER_LOAD = 8;

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
    const [numDisplayedItems, setNumDisplayedItems] = useState<number>(INITIAL_ITEMS_TO_SHOW);

    const handleLoadMore = () => {
        setNumDisplayedItems(prevCount => Math.min(prevCount + ITEMS_PER_LOAD, 77));
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                try {
                    const checkUser = await axios.put(`${server}/badge/getbyuser`, {}, {
                        headers: { aetheruid: user.uid }
                    });
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
            <div className='flex flex-col md:flex-row md:items-center md:place-content-between gap-1 md:gap-6 mt-1'>
                <h1 className='font-bold text-2xl'>{t('badge.title')}</h1>
                <p className='text-sm md:text-base md:font-semibold md:mt-0.5'>{`${badgee.length} ${t('badge.badgediscoverall')}`}</p>
            </div>
            <div className='grid grid-cols-1 gap-5 mt-4 mb-2'>
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
                                Array.from({ length: numDisplayedItems }).map((_, index) => (
                                    <motion.div initial={{ y: 30 }} animate={{ y: 0 }} key={index}>
                                        {
                                            badgee[index] ? <>
                                                <div className='flex flex-col items-center justify-center'>
                                                    <motion.div
                                                        whileHover={{ scale: 1.08 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Popover>
                                                            <PopoverTrigger>
                                                                <img loading={index + 1 > 10 ? 'lazy' : 'eager'} src={badgee[index].imageUrl} alt='Badge' className='w-32 md:w-40 cursor-pointer' />
                                                            </PopoverTrigger>
                                                            <PopoverContent>
                                                                <h1 className='flex items-center gap-2'><b className='flex items-center gap-1'><Footprints className='text-primary' /> {t('badge.visit')} :</b> {badgee[index].province.charAt(0).toUpperCase() + badgee[index].province.slice(1)}</h1>
                                                                <h2 className='mt-1'><b className='flex items-center gap-1'><Quote className='text-primary' /> {t('badge.slogan')} : </b> {badgee[index].slogan}</h2>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </motion.div>
                                                    <h2 className='font-semibold text-md md:text-lg mt-0.5'>{badgee[index].province.charAt(0).toUpperCase() + badgee[index].province.slice(1)}</h2>
                                                    <p className='text-sm md:text-base'>{new Date(badgee[index].recivedAt.seconds * 1000).toLocaleDateString()}</p>
                                                </div>
                                            </> : <>
                                                <div className='flex flex-col items-center justify-center opacity-80'>
                                                    <div className='w-28 md:w-38 border-2 border-primary aspect-square rounded-full border-dashed'></div>
                                                    <h2 className='font-semibold text-md md:text-lg mt-3 text-primary'>???</h2>
                                                    <p className='text-sm md:text-base text-primary'>???</p>
                                                </div>
                                            </>
                                        }
                                    </motion.div>
                                ))
                            }
                        </div>
                        {numDisplayedItems < 77 && (
                            <div className="mt-8 flex items-center justify-center">
                                <Button
                                    onClick={handleLoadMore}
                                >
                                    <ChevronDown />
                                    {t('more')}
                                </Button>
                            </div>
                        )}
                    </>
                }
            </div>
        </>
    )
}

export default BBadge