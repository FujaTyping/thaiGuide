"use client";

import { CalendarDays, Camera, CloudSun, HandCoins, Siren, TentTree, Utensils } from 'lucide-react';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import SDG from "@/assets/media/sdg/SDGs.svg";

const ToolsItems = [
    {
        title: "restaurant",
        icon: Utensils,
        link: "/restaurant"
    },
    {
        title: "event",
        icon: CalendarDays,
        link: "/event"
    },
    {
        title: "activity",
        icon: TentTree,
        link: "/activity"
    },
    {
        title: "sos",
        icon: Siren,
        link: "/sos"
    },
    {
        title: "weather",
        icon: CloudSun,
        link: "/weather"
    },
    {
        title: "Camera",
        icon: Camera,
        link: "/camera"
    },
    {
        title: "vat",
        icon: HandCoins,
        link: "https://play.google.com/store/apps/details?id=th.co.ktb.vrt&pcampaignid=web_share"
    },
    {
        title: "SDGs",
        image: SDG,
        link: "/sdgs"
    }
]

function Tools() {
    const t = useTranslations('ToolBar');

    return (
        <>
            <main className='max-w-7xl mx-auto px-3 py-6'>
                <h1 className='text-2xl md:text-3xl font-bold text-[#f7740a] mb-5'>{t('title')}</h1>
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
                    modules={[Autoplay]}
                    loop={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                >
                    {
                        ToolsItems.map((item, index) => (
                            <SwiperSlide key={index}>
                                <Link href={item.link}>
                                    <div className='flex flex-col items-center gap-2 group'>
                                        <div className='bg-[#f7740a] w-fit p-4 rounded-full'>
                                            {
                                                item.image ? (
                                                    <img className='group-hover:scale-120 transition-all duration-150 w-6.5' src={item.image.src} alt="Icon" />
                                                ) : item.icon && (
                                                    <item.icon className='text-white group-hover:scale-120 transition-all duration-150' />
                                                )
                                            }
                                        </div>
                                        <h1 className='text-lg font-semibold group-hover:text-[#f7740a] transition-all duration-150'>{t(`item.${item.title}`)}</h1>
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