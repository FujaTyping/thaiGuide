"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import Image from 'next/image';

// Image Assets
import SMH from "@/assets/media/หาดสมิหลา.webp"
import KRY from "@/assets/media/วัดเข้ารูปช้าง.webp"
import OTR from "@/assets/media/เมืองเก่า.webp"
import KYY from "@/assets/media/เกาะยอ.webp"
import KIY from "@/assets/media/กิมหยง.webp"

const BannerItems = [
    {
        title: "Samila Beach",
        decs: "Samila Beach, Ratchadamnoen Nok Road, Bo Yang Subdistrict, Mueang Songkhla District, Songkhla Province",
        image: SMH
    },
    {
        title: "Khao Rup Chang Temple",
        decs: "Moo 6, Padang Besar Subdistrict, Sadao District, Songkhla Province",
        image: KRY
    },
    {
        title: "Old Town Songkhla",
        decs: "Bo Yang Subdistrict, Mueang Songkhla District, Songkhla Province",
        image: OTR
    },
    {
        title: "Ko Yo Island",
        decs: "Ko Yo Subdistrict, Mueang Songkhla District, Songkhla Province",
        image: KYY
    },
    {
        title: "Kim Yong Market",
        decs: "Supasarnrangsan Road, Hat Yai District, Songkhla Province",
        image: KIY
    }
]

function Banner() {
    return (
        <>
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                modules={[EffectFade, Autoplay]}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                effect={'fade'}
            >
                {
                    BannerItems.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className='relative overflow-hidden rounded-b-4xl'
                            >
                                <Image fetchPriority='high' src={item.image.src} className='w-full h-[550px] md:h-[700px] object-cover' height={1080} width={1280} alt={item.title} />
                                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#f7740a]/70 to-transparent text-white rounded-b-4xl text-center'>
                                    <h1 className='text-3xl md:text-4xl font-bold mb-2'>{item.title}</h1>
                                    <p className='text-sm md:text-base'>{item.decs}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </>
    )
}

export default Banner