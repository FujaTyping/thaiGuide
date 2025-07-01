"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import Loader from '../components/loader';
import axios from 'axios';
import { server } from "@/app/config.json";
import { useTranslations } from 'next-intl';
import { motion } from "motion/react";
import { ChevronDown } from 'lucide-react';

import NF from "@/assets/media/card/icon/notfound.png";

import PA from "@/assets/media/icon/PA.png";
import PR from "@/assets/media/icon/PR.png";
interface Transaction {
    point: string;
    type: string;
    place: string;
}

const INITIAL_ITEMS_TO_SHOW = 10;
const ITEMS_PER_LOAD = 10;

function Details() {
    const t = useTranslations('Profile');
    const [user, setUser] = useState<User | null>(null);
    const [transcaton, setTranscaton] = useState<Transaction[] | null>(null);
    const [numDisplayedItems, setNumDisplayedItems] = useState<number>(INITIAL_ITEMS_TO_SHOW);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const checkUser = await axios.put(`https://${server}/transactions/getbyuser`, {
                    userid: user.uid
                })
                setTranscaton(checkUser.data.transactions);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!user || !transcaton) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        )
    }

    const itemsToDisplay = transcaton.slice(0, numDisplayedItems);

    const handleLoadMore = () => {
        setNumDisplayedItems(prevCount => Math.min(prevCount + ITEMS_PER_LOAD, transcaton.length));
    };

    return (
        <>
            <div className='grid grid-cols-1 gap-5 mt-4'>
                {
                    transcaton.length == 0 ? <>
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
                            <p className='font-semibold'>{t('notrans')}</p>
                        </div>
                    </> : <>
                        {
                            itemsToDisplay.map((item, index: number) => (
                                <div key={index} className='flex items-center place-content-between'>
                                    <div className='flex items-center gap-3'>
                                        {
                                            item.point.includes("-") ? <>
                                                <img className='w-18' src={PR.src} alt="Icon" />
                                            </> : <>
                                                <img className='w-18' src={PA.src} alt="Icon" />
                                            </>
                                        }
                                        <div>
                                            <p className='font-semibold text-lg'>{t(`transaction.${item.type}`)}</p>
                                            <p>{item.place}</p>
                                        </div>
                                    </div>
                                    <p className='font-semibold text-lg'>{item.point}</p>
                                </div>
                            ))
                        }
                    </>
                }
            </div>
            {numDisplayedItems < transcaton.length && (
                <div className="mt-8 flex items-center justify-center">
                    <button
                        onClick={handleLoadMore}
                        className="flex items-center gap-3 w-full md:w-fit justify-center bg-[#f7740a] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-[#f7640a] cursor-pointer"
                    >
                        <ChevronDown />
                        {t('more')}
                    </button>
                </div>
            )}
        </>
    )
}

export default Details