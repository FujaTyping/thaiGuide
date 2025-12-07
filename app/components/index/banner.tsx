"use client";

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import PHD from "@/assets/media/Placeholder.png";
import axios from 'axios';
import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';
import { server } from "@/app/config.json"
import Image from 'next/image';

interface BITEMS {
    title: string;
    image: string;
    decs: string;
    link?: string;
}

function Banner() {
    const [showPlace, setShowPlace] = useState(true);
    const [BannerItems, setBannerItems] = useState<BITEMS[]>([])

    useEffect(() => {
        async function getdata() {
            const res = await axios.get(`${server}/banner`);
            setBannerItems(res.data);
            setShowPlace(false);
        }
        getdata();
    }, [])

    return (
        <>
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                modules={[EffectFade, Autoplay]}
                autoplay={{
                    delay: 10000,
                    disableOnInteraction: false,
                }}
                effect={'fade'}
            >
                {
                    showPlace && (
                        <SwiperSlide>
                            <div
                                className='relative overflow-hidden rounded-b-4xl w-full h-[550px] md:h-[700px] '
                            >
                                <Image fetchPriority={'high'} src={PHD.src} className='object-cover' fill alt={'Placeholder'} />
                                <LoaderCircle className="absolute top-[70%] left-1/2 z-99 -translate-x-1/2 -translate-y-1/2 animate-spin text-primary w-10 h-10" />
                                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-primary/70 to-transparent text-white rounded-b-4xl text-center'></div>
                            </div>
                        </SwiperSlide>
                    )
                }
                {
                    BannerItems.map((item, index) => {
                        const slideContent = (
                            <div className='relative overflow-hidden rounded-b-4xl w-full h-[550px] md:h-[700px] '>
                                <Image fill loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : 'auto'} src={item.image} className='object-cover' alt={item.title} />
                                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-primary/70 to-transparent text-white rounded-b-4xl text-center'>
                                    <h1 className='text-3xl md:text-4xl font-bold mb-2'>{item.title}</h1>
                                    <p className='text-sm md:text-base'>{item.decs}</p>
                                </div>
                            </div>
                        );

                        return (
                            <SwiperSlide key={index}>
                                {item.link ? <Link href={item.link}>{slideContent}</Link> : slideContent}
                            </SwiperSlide>
                        );
                    })
                }
            </Swiper>
        </>
    )
}

export default Banner