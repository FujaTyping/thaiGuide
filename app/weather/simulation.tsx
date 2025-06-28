"use client";

import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { CalendarClock, CloudRain, Info, Sun, Wind } from 'lucide-react';
import SN from "@/assets/media/weather/sun.gif";
import RN from "@/assets/media/weather/rain.gif";
import SS from "@/assets/media/weather/snow-storm.gif";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from 'next-intl';

const Event = [
    [
        "New Year’s Day",
        "Children’s Day",
        "Teachers’ Day"
    ],
    [
        "Chiang Mai Flower Festival",
        "Trang Underwater Wedding",
        "Makha Bucha Day"
    ],
    [
        "National Thai Elephant Day",
        "National Muay Thai Day"
    ],
    [
        "Poy Sang Long Festival",
        "Songkran Thai New Year Water Festival"
    ],
    [
        "Visakha Bucha Day",
        "Rocket Festivals, Isaan",
        "Royal Ploughing Ceremony, Bangkok"
    ],
    [
        "Birthday of HM Queen Suthida"
    ],
    [
        "Phi Ta Khon Ghost Festival, Loei",
        "Asahna Bucha Day",
        "Khao Phansa",
        "Ubon Ratchathani Candle Festival"
    ],
    [
        "HM Queen Sirikit The Queen Mother’s Birthday",
        "Por Tor (Hungry Ghost Festival), Phuket"
    ],
    [
        "Thai National Flag Day"
    ],
    [
        "Awk Phansa",
        "Phuket Vegetarian Festival"
    ],
    [
        "Loy Krathong",
        "Yi Peng Lantern Festival, Chiang Mai"
    ],
    [
        "King Bhumibol Birthday Commemoration Day",
        "Constitution Day",
        "New Year's Eve"
    ]
]

function Simulation() {
    const t = useTranslations('WeaATem');
    const mo = useTranslations('Month');
    const [stateS, setStateS] = useState([0]);

    return (
        <>
            <div className='flex items-center place-content-between mb-3'>
                <p className='flex items-center gap-2'><CloudRain /> {t('simu.s1')}</p>
                <p className='flex items-center gap-2'><Sun /> {t('simu.s2')}</p>
                <p className='flex items-center gap-2'><Wind /> {t('simu.s3')}</p>
            </div>
            <Slider defaultValue={[0]} max={11} step={1} onValueChange={setStateS} />
            <div className='mt-5'>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={stateS[0]}
                        initial={{ x: 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {(stateS[0] >= 2 && stateS[0] <= 4) &&
                            <div className='grid md:grid-cols-2 gap-6'>
                                <div>
                                    <div className='flex items-center gap-4'>
                                        <img className='w-32' src={SN.src} alt="Sun" />
                                        <div>
                                            <h1 className='font-semibold text-3xl'>{mo(`${stateS[0]}`)}</h1>
                                            <div className='mt-1 text-lg'>
                                                <p className='font-medium'>{t('simu.hot.decs')}</p>
                                                <p>{t('simu.hot.range')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='mt-2'>{t('simu.hot.info')}</p>
                                </div>
                                <div>
                                    <h1 className='flex items-center gap-2 font-semibold text-lg'><CalendarClock className='text-[#f7740a]' /> {t('simu.event')}</h1>
                                    <ul className='mt-2 list-disc list-inside'>
                                        {
                                            Event[stateS[0]].map((event, index) => (
                                                <li key={index}>{event}</li>
                                            ))
                                        }
                                    </ul>
                                    <h1 className='mt-4 flex items-center gap-2 font-semibold text-lg'><Info className='text-[#f7740a]' /> {t('simu.tip')}</h1>
                                    <ul className='mt-2 list-disc list-inside'>
                                        <li>{t('simu.hot.tips.0')}</li>
                                        <li>{t('simu.hot.tips.1')}</li>
                                        <li>{t('simu.hot.tips.2')}</li>
                                        <li>{t('simu.hot.tips.3')}</li>
                                    </ul>
                                </div>
                            </div>
                        }
                        {(stateS[0] >= 5 && stateS[0] <= 9) &&
                            <div className='grid md:grid-cols-2 gap-6'>
                                <div>
                                    <div className='flex items-center gap-4'>
                                        <img className='w-32' src={RN.src} alt="Rain" />
                                        <div>
                                            <h1 className='font-semibold text-3xl'>{mo(`${stateS[0]}`)}</h1>
                                            <div className='mt-1 text-lg'>
                                                <p className='font-medium'>{t('simu.rain.decs')}</p>
                                                <p>{t('simu.rain.range')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='mt-2'>{t('simu.rain.info')}</p>
                                </div>
                                <div>
                                    <h1 className='flex items-center gap-2 font-semibold text-lg'><CalendarClock className='text-[#f7740a]' /> {t('simu.event')}</h1>
                                    <ul className='mt-2 list-disc list-inside'>
                                        {
                                            Event[stateS[0]].map((event, index) => (
                                                <li key={index}>{event}</li>
                                            ))
                                        }
                                    </ul>
                                    <h1 className='mt-4 flex items-center gap-2 font-semibold text-lg'><Info className='text-[#f7740a]' /> {t('simu.tip')}</h1>
                                    <ul className='mt-2 list-disc list-inside'>
                                        <li>{t('simu.rain.tips.0')}</li>
                                        <li>{t('simu.rain.tips.1')}</li>
                                        <li>{t('simu.rain.tips.2')}</li>
                                        <li>{t('simu.rain.tips.3')}</li>
                                    </ul>
                                </div>
                            </div>
                        }
                        {(stateS[0] <= 1 || stateS[0] >= 10) &&
                            <div className='grid md:grid-cols-2 gap-6'>
                                <div>
                                    <div className='flex items-center gap-4'>
                                        <img className='w-32' src={SS.src} alt="Cool" />
                                        <div>
                                            <h1 className='font-semibold text-3xl'>{mo(`${stateS[0]}`)}</h1>
                                            <div className='mt-1 text-lg'>
                                                <p className='font-medium'>{t('simu.cold.decs')}</p>
                                                <p>{t('simu.cold.range')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='mt-2'>{t('simu.cold.info')}</p>
                                </div>
                                <div>
                                    <h1 className='flex items-center gap-2 font-semibold text-lg'><CalendarClock className='text-[#f7740a]' /> {t('simu.event')}</h1>
                                    <ul className='mt-2 list-disc list-inside'>
                                        {
                                            Event[stateS[0]].map((event, index) => (
                                                <li key={index}>{event}</li>
                                            ))
                                        }
                                    </ul>
                                    <h1 className='mt-4 flex items-center gap-2 font-semibold text-lg'><Info className='text-[#f7740a]' /> {t('simu.tip')}</h1>
                                    <ul className='mt-2 list-disc list-inside'>
                                        <li>{t('simu.cold.tips.0')}</li>
                                        <li>{t('simu.cold.tips.1')}</li>
                                        <li>{t('simu.cold.tips.2')}</li>
                                        <li>{t('simu.cold.tips.3')}</li>
                                    </ul>
                                </div>
                            </div>
                        }
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    )
}

export default Simulation