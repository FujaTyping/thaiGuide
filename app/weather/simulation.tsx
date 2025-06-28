"use client";

import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { CalendarClock, CloudRain, Info, Snowflake, Sun } from 'lucide-react';
import SN from "@/assets/media/weather/sun.gif";
import RN from "@/assets/media/weather/rain.gif";
import SS from "@/assets/media/weather/snow-storm.gif";
import { AnimatePresence, motion } from "motion/react";

const Month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

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
    const [stateS, setStateS] = useState([0]);

    return (
        <>
            <div className='flex items-center place-content-between mb-3'>
                <p className='flex items-center gap-2'><CloudRain /> January</p>
                <p className='flex items-center gap-2'><Sun /> June</p>
                <p className='flex items-center gap-2'><Snowflake /> December</p>
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
                                            <h1 className='font-semibold text-3xl'>{Month[stateS[0]]}</h1>
                                            <div className='mt-1 text-lg'>
                                                <p className='font-medium'>Hot Season</p>
                                                <p>March - May</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='mt-2'>During {"Thailand's"} hot season, from March to May, expect bright, sunny days perfect for beach activities and island hopping. Temperatures can soar, especially in April, making it the ideal time for refreshing drinks and water-based fun. This period also hosts the famous Songkran festival {"(Thai New Year)"}, where nationwide water fights offer a joyful way to cool down.</p>
                                </div>
                                <div>
                                    <h1 className='flex items-center gap-2 font-semibold text-lg'><CalendarClock className='text-[#f7740a]' /> Event in this month</h1>
                                    <ul className='mt-2 list-disc list-inside'>
                                        {
                                            Event[stateS[0]].map((event, index) => (
                                                <li key={index}>{event}</li>
                                            ))
                                        }
                                    </ul>
                                    <h1 className='mt-4 flex items-center gap-2 font-semibold text-lg'><Info className='text-[#f7740a]' /> Tips</h1>
                                    <ul className='mt-2 list-disc list-inside'>
                                        <li>Stay hydrated by drinking plenty of water throughout the day</li>
                                        <li>Wear lightweight and breathable clothing to stay cool</li>
                                        <li>Apply high-SPF sunscreen regularly, and wear a hat and sunglasses</li>
                                        <li>Plan outdoor activities for the early morning or late afternoon to avoid peak heat</li>
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
                                            <h1 className='font-semibold text-3xl'>{Month[stateS[0]]}</h1>
                                            <div className='mt-1 text-lg'>
                                                <p className='font-medium'>Rainy Season</p>
                                                <p>June - October</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='mt-2'>The rainy season, from June to October, brings lush green landscapes and fewer crowds. While you can expect afternoon downpours, they are often short-lived, leaving the rest of the day clear. {"It's"} a great time to see waterfalls at their most powerful and enjoy the vibrant, refreshed scenery</p>
                                </div>
                                <div>
                                    <h1 className='flex items-center gap-2 font-semibold text-lg'><CalendarClock className='text-[#f7740a]' /> Event in this month</h1>
                                    <ul className='mt-2 list-disc list-inside'>
                                        {
                                            Event[stateS[0]].map((event, index) => (
                                                <li key={index}>{event}</li>
                                            ))
                                        }
                                    </ul>
                                    <h1 className='mt-4 flex items-center gap-2 font-semibold text-lg'><Info className='text-[#f7740a]' /> Tips</h1>
                                    <ul className='mt-2 list-disc list-inside'>
                                        <li>Pack a waterproof jacket and umbrella.</li>
                                        <li>Wear non-slip shoes as surfaces can be slippery.</li>
                                        <li>Be flexible with outdoor plans due to potential rain.</li>
                                        <li>Enjoy the lush, green scenery and fewer tourists.</li>
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
                                            <h1 className='font-semibold text-3xl'>{Month[stateS[0]]}</h1>
                                            <div className='mt-1 text-lg'>
                                                <p className='font-medium'>Cool Season</p>
                                                <p>November - February</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='mt-2'>From November to February, the cool, dry season offers pleasant temperatures and clear skies, making it the most popular time to visit. {"It's"} perfect for exploring cities, trekking in the northern mountains, and enjoying outdoor festivals without the intense heat</p>
                                </div>
                                <div>
                                    <h1 className='flex items-center gap-2 font-semibold text-lg'><CalendarClock className='text-[#f7740a]' /> Event in this month</h1>
                                    <ul className='mt-2 list-disc list-inside'>
                                        {
                                            Event[stateS[0]].map((event, index) => (
                                                <li key={index}>{event}</li>
                                            ))
                                        }
                                    </ul>
                                    <h1 className='mt-4 flex items-center gap-2 font-semibold text-lg'><Info className='text-[#f7740a]' /> Tips</h1>
                                    <ul className='mt-2 list-disc list-inside'>
                                        <li>Bring a light jacket or sweater for cooler evenings, especially in the north.</li>
                                        <li>Book accommodation and flights in advance as {"it's"} peak tourist season.</li>
                                        <li>Enjoy outdoor activities like hiking and visiting national parks.</li>
                                        <li>Stay hydrated even if {"it's"} not hot.</li>
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