"use client";

import { Bed, CloudSun, HandCoins, Siren, Utensils } from 'lucide-react';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';

const ToolsItems = [
    {
        title: "Restaurant",
        icon: Utensils,
        link: "#"
    },
    {
        title: "Hotel",
        icon: Bed,
        link: "#"
    },
    {
        title: "SOS",
        icon: Siren,
        link: "/sos"
    },
    {
        title: "Weather",
        icon: CloudSun,
        link: "/weather"
    },
    {
        title: "Vat Refund",
        icon: HandCoins,
        link: "https://play.google.com/store/apps/details?id=th.co.ktb.vrt&pcampaignid=web_share"
    }
]

function Tools() {
    return (
        <>
            <main className='max-w-7xl mx-auto px-3 py-6'>
                <h1 className='text-2xl md:text-3xl font-bold text-[#f7740a] mb-5'>Travel Tools</h1>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={3}
                    breakpoints={{
                        640: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 4,
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 5,
                            spaceBetween: 50,
                        },
                    }}
                >
                    {
                        ToolsItems.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Link href={item.link}>
                                    <div className='flex flex-col items-center gap-2 group'>
                                        <div className='bg-[#f7740a] w-fit p-4 rounded-full'>
                                            <item.icon className='text-white group-hover:scale-120 transition-all duration-150' />
                                        </div>
                                        <h1 className='text-lg font-semibold group-hover:text-[#f7740a] transition-all duration-150'>{item.title}</h1>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </main>
        </>
    )
}

export default Tools