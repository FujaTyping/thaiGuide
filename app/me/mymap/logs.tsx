"use client";

import React, { useState, useEffect } from 'react'
import tgFetch from '@/lib/fetch';
import { server } from "@/app/config.json";
import { onAuthStateChanged } from 'firebase/auth';
import auth from '@/lib/firebaseAuth';
import Loader from '@/app/components/loader';
import moment from 'moment';
import { ChevronDown, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import NF from "@/assets/media/card/icon/notfound.svg";
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface itemList {
    name: string;
    province: string
    timestamp: {
        seconds: number
    }
}

const INITIAL_ITEMS_TO_SHOW = 10;
const ITEMS_PER_LOAD = 10;

function Logs() {
    const t = useTranslations('Mymap');
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [numDisplayedItems, setNumDisplayedItems] = useState<number>(INITIAL_ITEMS_TO_SHOW);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    setLoading(true);
                    const res = await tgFetch({
                        url: `${server}/code/logsbyid`, data: {
                            headers: {
                                aetheruid: user.uid
                            }
                        }
                    })
                    const datt = res.data.logs;
                    setData(datt);
                    setLoading(false);
                } catch {
                    setData("Error");
                    setLoading(false);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const itemsToDisplay = data.slice(0, numDisplayedItems);

    const handleLoadMore = () => {
        setNumDisplayedItems(prevCount => Math.min(prevCount + ITEMS_PER_LOAD, data.length));
    };

    if (!data || loading) return (
        <div className='w-full flex items-center justify-center my-12'>
            <Loader />
        </div>
    )

    return (
        <>
            {
                data.length > 0 ? <>
                    <div className='mt-5 flex flex-col items-start gap-4 mb-2'>
                        {itemsToDisplay.map((item: itemList, index: number) => (
                            <motion.div initial={{ y: 30 }} animate={{ y: 0 }} key={index} className={`flex items-center flex-row place-content-between gap-2 md:gap-3 w-full h-full ${index + 1 != itemsToDisplay.length && "border-b border-primary pb-4"}`}>
                                <div className='h-full'>
                                    <h1 className='font-semibold text-lg md:text-xl break-all'>{item.name}</h1>
                                    <p className='text-sm md:text-base mt-0.5 flex items-center gap-1'><MapPin className='text-primary' size={20} /> {item.province.charAt(0).toUpperCase() + item.province.slice(1)}</p>
                                </div>
                                <div className='h-full'
                                >
                                    <Tooltip>
                                        <TooltipTrigger><p className='bg-primary p-1 px-3 text-sm text-white rounded-full cursor-help'>{moment.unix(item.timestamp.seconds).fromNow()}</p></TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {moment.unix(item.timestamp.seconds).format('LL')}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {
                        numDisplayedItems < data.length && <div className="mt-6 flex items-center justify-center">
                            <Button onClick={handleLoadMore}>
                                <ChevronDown />
                                {t('more')}
                            </Button>
                        </div>
                    }
                </> :
                    <>
                        <div className='flex items-center flex-col justify-center pt-8 pb-2 gap-4'>
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
                            <p className='font-semibold'>{t('noenough')}</p>
                        </div>
                    </>
            }
        </>
    )
}

export default Logs