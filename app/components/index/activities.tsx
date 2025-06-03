"use client";

import React, { useState } from 'react';
import ZL from "@/assets/media/activities/type/zipline.jpg";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Star, Wallet } from 'lucide-react';
import SCB from "@/assets/media/activities/type/scubadriving.jpg";
import Link from 'next/link';

const Data = [
    {
        acttitle: "Zipline Adventure in Chiang Mai",
        location: "99 9 Pong Yaeng Subdistrict, Mae Rim District, Chiang Mai 50180",
        locationName: "Pong Yaeng Jungle Coaster & Zipline",
        decs: "Thrill seekers and adventure seekers take note! When you think of Thailand, it’s easy to imagine pristine beaches and bustling street markets. However, the northern city of Chiang Mai offers something completely different. Imagine speeding through a lush, green jungle, the wind whistling around your ears and panoramic views of the countryside below – welcome to the thrilling world of zip-lining in Chiang Mai.",
        priceRange: "฿1,000 - ฿2,250",
        rating: "4.4/5",
        image: ZL,
        link: "#"
    },
    {
        acttitle: "Scuba Diving in Phuket",
        location: "74 Rim Hat Soi, Kamala Subdistrict, Kathu District, Phuket 83150",
        locationName: "Merlin Divers - Scuba Diving Phuket",
        decs: "Dive beneath the azure waves of Thailand’s coastline and you’ll discover a world of life and color. Diving in Phuket offers a fascinating way to explore this underwater paradise and will delight any adventure seeker.",
        priceRange: "฿2,523 - ฿15,500",
        rating: "4.5/5",
        image: SCB,
        link: "#"
    }
]

function Activities() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? Data.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === Data.length - 1 ? 0 : prevIndex + 1));
    };

    const currentActivity = Data[currentIndex];

    return (
        <>
            <main className='max-w-7xl mx-auto px-3 py-6'>
                <div className='flex items-center place-content-between mb-6'>
                    <h1 className='text-2xl md:text-3xl font-bold text-[#f7740a]'>Activity</h1>
                    <div className='flex items-center gap-3'>
                        <div
                            className='border-2 border-[#f7740a] rounded-full p-2 hover:bg-[#f7740a] group transition-all duration-200 cursor-pointer'
                            onClick={handlePrev}
                        >
                            <ChevronLeft className='text-[#f7740a] group-hover:text-white' />
                        </div>
                        <div
                            className='border-2 border-[#f7740a] rounded-full p-2 hover:bg-[#f7740a] group transition-all duration-200 cursor-pointer'
                            onClick={handleNext}
                        >
                            <ChevronRight className='text-[#f7740a] group-hover:text-white' />
                        </div>
                    </div>
                </div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.2 }}
                        className='grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-8'
                    >
                        <motion.div
                            whileHover={{ rotateY: -15, rotateX: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className='relative md:col-span-2'
                        >
                            <Link href={currentActivity.link}>
                                <div>
                                    <img
                                        src={currentActivity.image.src}
                                        alt={currentActivity.acttitle}
                                        className='rounded-4xl h-[300px] md:h-[460px] w-full object-cover'
                                    />
                                    <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#f7740a]/70 to-transparent text-white rounded-b-4xl'>
                                        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-2'>{currentActivity.acttitle}</h1>
                                        <p className='text-xs md:text-sm'>{currentActivity.location}</p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                        <div className='flex flex-col place-content-between py-4 md:py-0'>
                            <div>
                                <h2 className='font-semibold text-xl md:text-2xl mb-2'>{currentActivity.locationName}</h2>
                                <p className='text-sm md:text-base'>{currentActivity.decs}</p>
                            </div>
                            <div className='grid grid-cols-2 gap-4 mt-4 md:mt-0'>
                                <div className='flex items-center gap-2 text-sm md:text-base'>
                                    <Wallet size={20} />
                                    {currentActivity.priceRange}
                                </div>
                                <div className='flex items-center gap-2 text-sm md:text-base'>
                                    <Star size={20} />
                                    {currentActivity.rating}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </>
    )
}

export default Activities;