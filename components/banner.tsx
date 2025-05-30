"use client"

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import B1 from "@/assets/banner/banner1.jpg"
import B2 from "@/assets/banner/banner2.jpg"
import B3 from "@/assets/banner/banner3.jpg"
import { EffectFade, Autoplay } from 'swiper/modules';

function Banner() {
    return (
        <>
            <Swiper
                spaceBetween={0}
                loop={true}
                effect={'fade'}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                modules={[EffectFade, Autoplay]}
                slidesPerView={1}
            >
                <SwiperSlide>
                    <div className="relative">
                        <div className='absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 bg-black bg-opacity-60 backdrop-blur-sm p-4 md:p-6 rounded-lg shadow-xl text-white max-w-xs sm:max-w-sm md:max-w-md z-10'>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2 font-poppins text-right">เขาตะปู</h1>
                            <p className="text-sm sm:text-base md:text-lg font-poppins text-right">ตำบลกะไหล อำเภอตะกั่วทุ่ง จังหวัดพังงา</p>
                        </div>
                        <img src={B1.src} alt="Banner 1" className='h-[650px] w-full object-cover' />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative">
                        <div className='absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 bg-black bg-opacity-60 backdrop-blur-sm p-4 md:p-6 rounded-lg shadow-xl text-white max-w-xs sm:max-w-sm md:max-w-md z-10'>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2 font-poppins text-right">Old Phuket Town</h1>
                            <p className="text-sm sm:text-base md:text-lg font-poppins text-right">อำเภอเมืองภูเก็ต ภูเก็ต 83000</p>
                        </div>
                        <img src={B2.src} alt="Banner 1" className='h-[650px] w-full object-cover' />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative">
                        <div className='absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 bg-black bg-opacity-60 backdrop-blur-sm p-4 md:p-6 rounded-lg shadow-xl text-white max-w-xs sm:max-w-sm md:max-w-md z-10'>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2 font-poppins text-right">วัดไชยธาราราม {"(วัดฉลอง)"}</h1>
                            <p className="text-sm sm:text-base md:text-lg font-poppins text-right">70 หมู่ที่ 6 ถ. เจ้าฟ้าตะวันตก ตำบล ฉลอง อำเภอเมืองภูเก็ต ภูเก็ต 83000</p>
                        </div>
                        <img src={B3.src} alt="Banner 1" className='h-[650px] w-full object-cover' />
                    </div>
                </SwiperSlide>
            </Swiper>
        </>
    )
}

export default Banner