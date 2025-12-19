"use client";

import React, { useState, useEffect } from 'react';
import tgFetch from '@/lib/fetch';
import { server } from "@/app/config.json";
import Loader from '../components/loader';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

interface Feedback {
    title: string;
    decs: string;
    experience: number;
    id: string;
}

const emojiz = ['😡', '😒', '😐', '🙂', '🤩']

function FeedbackBoard() {
    const [data, setData] = useState<Feedback[]>([]);

    useEffect(() => {
        async function fetchData() {
            const res = await tgFetch({ url: `${server}/feedback` });
            setData(res.data);
        }
        fetchData();
    }, [])

    if (data.length === 0) return (
        <div className='w-full flex items-center justify-center my-12'>
            <Loader />
        </div>
    )

    return (
        <div className='mb-4'>
            <Swiper
                slidesPerView={3}
                spaceBetween={20}
                className="feedback"
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                loop={true}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                    },
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                }}
            >
                {
                    data.map((item) => {
                        return (
                            <SwiperSlide key={item.id}>
                                <div key={item.id} className='relative bg-primary text-white rounded-2xl p-4 h-48 md:h-36 px-6 mt-6 w-fit flex items-center justify-center flex-col gap-1'>
                                    <h1 className='font-semibold text-xl text-center'>{item.title}</h1>
                                    <p className='max-w-xs text-center'>{item.decs.substring(0, 80)}{item.decs.length > 60 ? "..." : ""}</p>
                                    <p className='text-4xl absolute right-0 top-0 -mt-4 -mr-4'>{emojiz[item.experience - 1]}</p>
                                </div>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </div>
    )
}

export default FeedbackBoard