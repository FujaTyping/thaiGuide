"use client";

import React from 'react';
import { motion } from "motion/react";
import KT from "@/assets/media/food/kaitoddecha.jpg";
import MR from "@/assets/media/food/mavin.jpg";
import RB from "@/assets/media/food/เรือใบ.jpg";

const Data = [
    {
        thumnails: KT,
        name: "Decha Fried Chicken, Chee Uthit Branch",
        location: "93 Chee Uthit Road, Hat Yai Subdistrict, Songkhla",
        decs: "Famous for its delicious Hat Yai-style fried chicken, a must-try local delicacy.",
        spicylevel: "🔥",
        province: "Songkhla",
        price: "-",
        rating: "4.0"
    },
    {
        thumnails: MR,
        name: "Marwin Ramen",
        location: "69/17 Nipat Songkhro 3 Road, Hat Yai Subdistrict, Hat Yai District, Songkhla",
        decs: "A popular ramen restaurant known for its authentic Japanese noodles and flavorful broth.",
        spicylevel: "🔥🔥",
        province: "Songkhla",
        price: "1 - 100",
        rating: "4.5"
    },
    {
        thumnails: RB,
        name: "Ruea Bai Restaurant",
        location: "Sailboat Club Building, Chalatat Road, Mueang Songkhla, Songkhla",
        decs: "A popular restaurant at the Songkhla Sailboat Club, offering a variety of Thai dishes and seafood with scenic views, often overlooking Chalatat Beach.",
        spicylevel: "🔥🔥",
        province: "Songkhla",
        price: "=",
        rating: "4.3"
    },
]

function Grid() {
    return (
        <>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-4'>
                {
                    Data.map((item, index) => (
                        <motion.div
                            whileHover={{ scale: 1.03, rotate: -1 }}
                            whileTap={{ scale: 0.9 }}
                            className='relative'
                            key={index}
                        >
                            <div
                                className="w-full h-[350px] md:h-[500px] rounded-4xl overflow-hidden relative"
                            >
                                <img className='w-full h-full object-cover' src={item.thumnails.src} alt={item.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#f7740a]/70 via-transparent to-transparent"></div>
                            </div>
                            <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white rounded-b-4xl flex flex-col gap-2'>
                                <h1 className='text-2xl md:text-3xl font-bold pb-3 md:pb-0'>{item.name}</h1>
                                <p>{item.location}</p>
                            </div>
                        </motion.div>
                    ))
                }
            </div>
        </>
    )
}

export default Grid