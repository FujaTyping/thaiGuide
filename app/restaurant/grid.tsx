"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "motion/react";
import axios from 'axios';
import { server } from "@/app/config.json";
import Loader from '../components/loader';
import Link from 'next/link';

interface RestaurantItem {
    id: string;
    name: string;
    thumnails: string;
    location: string;
}

function Grid() {
    const [Data, setData] = useState<RestaurantItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://${server}/restaurant`);
                setData(response.data);
            } catch (err) {
                console.error("Error fetching restaurant:", err);
            }
        };

        fetchData();
    }, []);


    if (Data.length === 0) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        );
    }

    return (
        <>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-4'>
                {
                    Data.map((item, index) => (
                        <Link href={`restaurant/${item.id}`} key={index}>
                            <motion.div
                                whileHover={{ scale: 1.03, rotate: -1 }}
                                whileTap={{ scale: 0.9 }}
                                className='relative'
                            >
                                <div
                                    className="w-full h-[350px] md:h-[500px] rounded-4xl overflow-hidden relative"
                                >
                                    <img className='w-full h-full object-cover' src={item.thumnails} alt={item.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#f7740a]/70 via-transparent to-transparent"></div>
                                </div>
                                <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white rounded-b-4xl flex flex-col gap-2'>
                                    <h1 className='text-2xl md:text-3xl font-bold pb-3 md:pb-0'>{item.name}</h1>
                                    <p className='hidden md:block'>{item.location}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))
                }
            </div>
        </>
    )
}

export default Grid