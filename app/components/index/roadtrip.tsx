"use client";

import React from 'react';

import TN from "@/assets/media/roadtrip/ThaleNoi.webp";
import { MapPin } from 'lucide-react';

const Data = [
    {
        title: "Secrets of Songkhla",
        long: "2-3 Day, 10 Stops",
        location: "Road Wichian Chom, Songkhla to Khuan Khanun District",
        thumnails: TN,
        tags: ["Nature", "Cultural", "Adventure"]
    }
]

function Roadtrip() {
    return (
        <>
            <main className='max-w-7xl mx-auto px-3 py-6'>
                <div className='flex items-center place-content-between mb-6'>
                    <h1 className='text-2xl md:text-3xl font-bold text-[#f7740a]'>Road Trip Itineraries</h1>
                </div>
                <div className='grid grid-cols-1 gap-6'>
                    {
                        Data.map((item, index) => (
                            <div key={index} className='relative'>
                                <div
                                    className="w-full h-[100px] md:h-[150px] rounded-2xl overflow-hidden relative"
                                >
                                    <img className='w-full h-full object-cover' src={item.thumnails.src} alt={item.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#f7740a]/70 to-transparent"></div>
                                </div>
                                <div className='absolute left-0 right-0 top-1/2 -translate-y-1/2 p-4 md:p-8 text-white rounded-4xl text-center'>
                                    <h1 className='text-2xl md:text-3xl font-bold pb-0 md:pb-1'>{item.title}</h1>
                                    <p className='mt-1 hidden md:flex gap-2 items-center justify-center'><MapPin /> {item.location}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </main>
        </>
    )
}

export default Roadtrip