"use client";

import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { server } from "@/app/config.json";
import Loader from '../components/loader';
import { Coins } from 'lucide-react';
import Link from 'next/link';

interface RewardItem {
    image: string;
    name: string;
    decs: string;
    require: number;
    id: string;
}

function Grid() {
    const [data, setData] = useState<RewardItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${server}/reward`);
                setData(response.data);
            } catch (err) {
                console.error("Error fetching redeem:", err);
            }
        };

        fetchData();
    }, []);

    if (data.length === 0) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        );
    }

    return (
        <>
            <div className='grid grid-cols-1I md:grid-cols-3 gap-6 mt-6'>
                {
                    data.map((item: RewardItem, index) => (
                        <Link href={`/redeem/${item.id}`} key={index}>
                            <div className='flex items-center flex-col place-content-between gap-6 hover:scale-105 transition-all duration-200'>
                                <img src={item.image} alt="Product" className='rounded-xl h-62 object-cover' />
                                <div className='bg-primary w-full rounded-xl p-4 text-white'>
                                    <h1 className='font-semibold text-xl'>{item.name}</h1>
                                    <p className='mt-1 mb-2'>{item.decs}</p>
                                    <p className='flex justify-end gap-2 font-semibold'><Coins /> {item.require}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </>
    )
}

export default Grid