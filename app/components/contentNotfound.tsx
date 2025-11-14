"use client";

import React from 'react';
//import PHONOF from "@/assets/media/maskot/photo/BackFedUp.webp";
import NF from "@/assets/media/card/icon/notfound.svg";
import { useTranslations } from 'next-intl';
import { motion } from "motion/react";

function ContentNotfound() {
    const t = useTranslations('NotFound');

    return (
        <>
            <div className='tg-container flex items-center flex-col justify-center gap-4 my-16'>
                <motion.div
                    animate={{
                        x: [0, -10, 10, -10, 10, -5, 5, 0],
                    }}
                    transition={{
                        duration: 0.5,
                        ease: "easeInOut"
                    }}
                >
                    <img src={NF.src} alt="Icon" className='w-28 md:w-32 box translate-x-3' />
                </motion.div>
                <div className='flex items-center justify-center text-center gap-1 flex-col'>
                    <h1 className='font-semibold text-2xl'>{t('title')}</h1>
                    <p>{t('decs')}</p>
                </div>
            </div>
        </>
    )
}

export default ContentNotfound