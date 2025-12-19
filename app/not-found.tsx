"use client";

import React from 'react';
import FOF from "@/assets/media/icon/fof.svg";
import { motion } from 'motion/react';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from 'next-intl';

function Notfound() {
    const t = useTranslations('Notfound');

    return (
        <>
            <div className='tg-container h-[70vh] flex flex-col md:flex-row items-center justify-center gap-8u md:gap-24'>
                <motion.div
                    animate={{
                        x: [0, 20, 5, -15, -10, 0],
                        rotateZ: [0, -7, 0, 0, 0, 0]
                    }}
                    transition={{
                        duration: 6,
                        ease: "easeInOut",
                        times: [0, 0.25, 0.4, 0.65, 0.8, 1],
                        repeat: Infinity,
                        repeatDelay: 1,
                    }}
                >
                    <Link href={"/"}>
                        <Tooltip>
                            <TooltipTrigger className='cursor-pointer'><img src={FOF.src} alt="Icon" className='w-42 md:w-58' /></TooltipTrigger>
                            <TooltipContent>
                                <p>{t('tooltip')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </Link>
                </motion.div>
                <div className='max-w-2xl'>
                    <h1 className='mb-2 font-bold text-4xl text-primary'>404</h1>
                    <h1 className='font-bold text-3xl'>{t('title')}</h1>
                    <p className='mt-2'>{t('decs')} <b>{t('back')}</b>.</p>
                </div>
            </div>
        </>
    )
}

export default Notfound