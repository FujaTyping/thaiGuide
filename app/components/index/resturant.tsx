"use client";

import React, { useState, useEffect, useRef } from 'react';

import axios from "axios";
import Loader from '@/app/components/loader';
import { server } from "@/app/config.json";
import Link from 'next/link';
import { motion } from "motion/react";
import SwiperCore from 'swiper';
import { ChefHat, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const textVariants = {
  hovered: { y: -15 }
};

interface RoadtripItem {
  id: string;
  name: string;
  thumnails: string;
  location: string;
}

function Resturant() {
  const t = useTranslations('IndexRus');
  const [Data, setData] = useState<RoadtripItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://${server}/restaurant`);
        const fetchedRestaurants: RoadtripItem[] = response.data || [];

        if (fetchedRestaurants.length > 7) {
          const shuffled = [...fetchedRestaurants].sort(() => 0.5 - Math.random());
          setData(shuffled.slice(0, 7));
        } else {
          setData(fetchedRestaurants);
        }
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setData([]);
      }
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <main className='max-w-7xl mx-auto px-3 py-6'>
        <div className='flex items-center place-content-between mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-[#f7740a]'>{t('headder')}</h1>
          <div className='flex items-center gap-3'>
            <div className='border-2 border-[#f7740a] rounded-full p-2 hover:bg-[#f7740a] group transition-all duration-200 cursor-pointer' onClick={goPrev}>
              <ChevronLeft className='text-[#f7740a] group-hover:text-white' />
            </div>
            <div className='border-2 border-[#f7740a] rounded-full p-2 hover:bg-[#f7740a] group transition-all duration-200 cursor-pointer' onClick={goNext}>
              <ChevronRight className='text-[#f7740a] group-hover:text-white' />
            </div>
          </div>
        </div>
        {
          loading ? <>
            <div className='w-full flex items-center justify-center my-12'>
              <Loader />
            </div>
          </> : <>
            <Swiper
              spaceBetween={30}
              slidesPerView={2}
              breakpoints={{
                640: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                }
              }}
              onSwiper={(swiper) => swiperRef.current = swiper}
            >
              {
                Data.map((item, index) => (
                  <SwiperSlide key={index}>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href={`restaurant/${item.id}`}>
                        <motion.div
                          className="relative"
                          initial="rest"
                          whileHover="hovered"
                          animate="rest"
                        >
                          <div
                            className="w-full h-[350px] md:h-[500px] rounded-4xl overflow-hidden relative"
                          >
                            <Image width={1080} height={1280} className='w-full h-full object-cover' src={item.thumnails} alt={item.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#f7740a]/70 via-transparent to-transparent"></div>
                          </div>
                          <motion.div
                            variants={textVariants}
                          >
                            <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white rounded-b-4xl'>
                              <h1 className='text-2xl md:text-3xl font-bold pb-3 md:pb-0'>{item.name}</h1>
                              <p className='mt-1 hidden md:block'>{item.location}</p>
                            </div>
                          </motion.div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </SwiperSlide>
                ))
              }
              <SwiperSlide>
                <Link href={"/restaurant"}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className='flex items-center justify-center flex-col h-[350px] gap-4 md:h-[500px] bg-[#f7740a] text-white rounded-4xl'
                  >
                    <div className='p-3 border-2 rounded-full'>
                      <ChefHat className='w-10 h-10' />
                    </div>
                    <div className='flex flex-col items-center justify-centerI'>
                      <h1 className='font-semibold text-xl mb-1'>Hungry for More?</h1>
                      <p className='max-w-[90%] text-center'>Click to check out the restaurant page</p>
                    </div>
                  </motion.div>
                </Link>
              </SwiperSlide>
            </Swiper>
          </>
        }
      </main>
    </>
  )
}

export default Resturant