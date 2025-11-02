"use client"

import React, { useState, useEffect } from 'react'
//import MSK from "@/assets/media/maskot/photo/BackEncourage.webp";
import { X } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { setCookie, getCookie } from 'cookies-next/client';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

function Alertbox() {
    const t = useTranslations('installbx');
    const [showCTA, setShowCTA] = useState(false);

    useEffect(() => {
        function checkNotShow() {
            const CK = getCookie('DownloadCTA');
            if (CK != "YeahIDontwantAD" && CK != undefined) setShowCTA(true);
        }
        checkNotShow();
    }, [])

    return (
        <>
            <div className='fixed bottom-0 left-0 p-4 z-1 space-y-1'>
                <AnimatePresence mode="wait">

                    {
                        showCTA && <motion.div
                            key={showCTA ? 'show' : 'hide'}
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className='space-y-2'
                        >

                            <img src={"/icon-512x512.png"} alt="Maskot" className='w-24 md:w-28 bottom-0 border-3 border-primary rounded-2xl' />
                            <Link href={'/install'}>
                                <div className='bg-white border-3 border-primary w-fit rounded-2xl p-3 px-4'>
                                    <div className='space-y-1'>
                                        <h1 className='font-bold text-md md:text-lg text-primary'>{t('title')}</h1>
                                        <p className='max-w-[200px] text-sm'>{t('decs')}</p>
                                    </div>
                                </div>
                            </Link>
                            <div className='absolute right-5 top-5'>
                                <div className='bg-white rounded-full p-1 border-2 border-primary' onClick={() => { setShowCTA(false); setCookie('DownloadCTA', 'YeahIDontwantAD', {}) }}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <X className='text-primary w-5 md:w-6 h-5 md:h-6 z-2 cursor-pointer' />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{t('idontwanasee')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence >
            </div>
        </>
    )
}

export default Alertbox