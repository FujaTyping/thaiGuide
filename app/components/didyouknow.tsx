"use client";

import { MessageCircleQuestion } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from "motion/react";
import { useTranslations } from 'next-intl';

const Data = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
];

function Didyouknow() {
    const t = useTranslations('GBdyk');
    const [selectedFact, setSelectedFact] = useState<string>("0");

    useEffect(() => {
        setSelectedFact(Data[Math.floor(Math.random() * Data.length)]);
    }, []);

    return (
        <>
            <main className='max-w-7xl mx-auto px-3 mb-6'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <div className='bg-primary text-white flex flex-col gap-3 items-center justify-center py-6 rounded-2xl px-4'>
                        <MessageCircleQuestion className='size-8 md:size-10' />
                        <h1 className='font-bold text-2xl md:text-3xl'>{t('title')}</h1>
                        <p className='max-w-3xl'>{t(`text.${selectedFact}`)}</p>
                    </div>
                </motion.div>
            </main>
        </>
    )
}

export default Didyouknow