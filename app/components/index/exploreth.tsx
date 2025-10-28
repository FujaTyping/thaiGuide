"use client";

import Link from 'next/link';
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SwiperCore from 'swiper';

import RT from "@/assets/media/region/ภาคใต้.jpg"
import CT from "@/assets/media/region/ภาคกลาง.jpg"
import NT from "@/assets/media/region/ภาคเหนือ.jpg"
import ET from "@/assets/media/region/ภาคตะวันตก.jpg"
import WT from "@/assets/media/region/ภาคตะวันออก.jpg"
import NET from "@/assets/media/region/ภาคอีสาน.jpg"

const RegionItems = [
    {
        title: "Northern Region",
        image: NT,
        decs: "Mountainous region, source of rivers, and home to Doi Inthanon, Thailand's highest peak, known for winter frost ('Mae Khaning').",
        link: "#"
    },
    {
        title: "Central Region",
        image: CT,
        decs: "A fertile plain, key for rice cultivation, featuring historic temples along the Chao Phraya River with rich architectural and artistic heritage.",
        link: "#"
    },
    {
        title: "Southern Region",
        image: RT,
        decs: "Famous for stunning beaches and islands on both the Gulf of Thailand and Andaman Sea, including Phuket, Koh Samui, and Koh Phi Phi.",
        link: "#"
    },
    {
        title: "Eastern Region",
        image: WT,
        decs: "Offers a mix of mountains and sea, with popular destinations like Koh Samet, Koh Chang, Pattaya, and Bang Saen.",
        link: "#"
    },
    {
        title: "Northeastern Region",
        image: NET,
        decs: "An upland plateau known for Jasmine rice and the Mekong River, featuring attractions like Chiang Khan in Loei.",
        link: "#"
    },
    {
        title: "Western Region",
        image: ET,
        decs: "Characterized by steep mountains, lush forests, waterfalls, and historical sites like the Bridge on the River Kwai and ancient temples.",
        link: "#"
    }
]

const textVariants = {
    hovered: { y: -15 }
};

function Exploreth() {
    const swiperRef = useRef<SwiperCore | null>(null);

    const goNext = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    const goPrev = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    return (
        <>
            <main className='max-w-7xl mx-auto px-3 py-6'>
                <div className='flex items-center place-content-between mb-6'>
                    <h1 className='text-2xl md:text-3xl font-bold text-primary'>Destination By Region</h1>
                    <div className='flex items-center gap-3'>
                        <div className='border-2 border-primary rounded-full p-2 hover:bg-primary group transition-all duration-200 cursor-pointer' onClick={goPrev}>
                            <ChevronLeft className='text-primary group-hover:text-white' />
                        </div>
                        <div className='border-2 border-primary rounded-full p-2 hover:bg-primary group transition-all duration-200 cursor-pointer' onClick={goNext}>
                            <ChevronRight className='text-primary group-hover:text-white' />
                        </div>
                    </div>
                </div>
                <Swiper
                    spaceBetween={30}
                    slidesPerView={2}
                    breakpoints={{
                        640: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 4,
                            spaceBetween: 30,
                        }
                    }}
                    onSwiper={(swiper) => swiperRef.current = swiper}
                >
                    {
                        RegionItems.map((item, index) => (
                            <SwiperSlide key={index}>
                                <motion.div
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link href={item.link}>
                                        <motion.div
                                            className="relative"
                                            initial="rest"
                                            whileHover="hovered"
                                            animate="rest"
                                        >
                                            <div
                                                className="w-full h-[350px] md:h-[500px] rounded-4xl overflow-hidden relative"
                                            >
                                                <img className='w-full h-full object-cover' src={item.image.src} alt={item.title} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent"></div>
                                            </div>
                                            <motion.div
                                                variants={textVariants}
                                            >
                                                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white rounded-b-4xl'>
                                                    <h1 className='text-2xl md:text-3xl font-bold pb-3 md:pb-0'>{item.title}</h1>
                                                    <p className='mt-1 hidden md:block'>{item.decs}</p>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </main>
        </>
    )
}

export default Exploreth