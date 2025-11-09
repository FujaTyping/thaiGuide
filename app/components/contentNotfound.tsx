"use client";

import React from 'react';
import PHONOF from "@/assets/media/maskot/photo/BackFedUp.webp";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslations } from 'next-intl';

function ContentNotfound() {
    const t = useTranslations('NotFound');

    gsap.registerPlugin(useGSAP);

    useGSAP(() => {
        gsap.to('.box', { keyframes: { y: [8, -8, 8], scale: [0.95, 1, 0.95] }, repeat: -1, duration: 1.5 });
    });

    return (
        <>
            <div className='flex items-center flex-col justify-center gap-4 py-8'>
                <img src={PHONOF.src} alt="Icon" className='w-38 md:w-42 box' />
                <div className='flex items-center justify-center text-center gap-1 flex-col'>
                    <p className='font-semibold text-2xl'>{t('title')}</p>
                    <p>{t('decs')}</p>
                </div>
            </div>
        </>
    )
}

export default ContentNotfound