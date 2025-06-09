"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "motion/react";
import axios from 'axios';
import { server } from "@/app/config.json";
import Loader from '../components/loader';
import Link from 'next/link';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import NF from "@/assets/media/card/icon/notfound.png";

const provinceFilterOptions = [
    "Amnat Charoen", "Ang Thong", "Bangkok", "Bueng Kan", "Buri Ram", "Chachoengsao", "Chai Nat", "Chaiyaphum", "Chanthaburi", "Chiang Mai",
    "Chiang Rai", "Chon Buri", "Chumphon", "Kalasin", "Kamphaeng Phet", "Kanchanaburi", "Khon Kaen", "Krabi", "Lampang", "Lamphun",
    "Loei", "Lop Buri", "Mae Hong Son", "Maha Sarakham", "Mukdahan", "Nakhon Nayok", "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima", "Nakhon Sawan",
    "Nakhon Si Thammarat", "Nan", "Narathiwat", "Nong Bua Lam Phu", "Nong Khai", "Nonthaburi", "Pathum Thani", "Pattani", "Phangnga", "Phatthalung",
    "Phayao", "Phetchabun", "Phetchaburi", "Phichit", "Phitsanulok", "Phra Nakhon Si Ayutthaya", "Phrae", "Phuket", "Prachin Buri", "Prachuap Khiri Khan",
    "Ranong", "Ratchaburi", "Rayong", "Roi Et", "Sa Kaeo", "Sakon Nakhon", "Samut Prakan", "Samut Sakhon", "Samut Songkhram", "Saraburi",
    "Satun", "Si Sa Ket", "Sing Buri", "Songkhla", "Sukhothai", "Suphan Buri", "Surat Thani", "Surin", "Tak", "Trang",
    "Trat", "Ubon Ratchathani", "Udon Thani", "Uthai Thani", "Uttaradit", "Yala", "Yasothon"
];
const ALL_PROVINCES_VALUE = "All";

interface RestaurantItem {
    province: string;
    id: string;
    name: string;
    thumnails: string;
    location: string;
}

function Grid() {
    const [data, setData] = useState<RestaurantItem[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>("Songkhla");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`https://${server}/restaurant`);
                setData(response.data);
            } catch (err) {
                console.error("Error fetching restaurant:", err);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        );
    }

    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
    };

    const filteredData = data.filter(item => {
        if (selectedProvince === ALL_PROVINCES_VALUE) return true;
        return item.province.toLowerCase() === selectedProvince.toLowerCase();
    });

    return (
        <>
            <div className='mt-6 flex flex-col md:flex-row md:items-center place-content-between'>
                <div className='flex items-center gap-2'>
                    <p className='font-semibold'>Filter by Province : </p>
                    <Select onValueChange={handleProvinceChange} defaultValue={"Songkhla"}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select a Province" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_PROVINCES_VALUE}>All Provinces</SelectItem>
                            {
                                provinceFilterOptions.map((province, index) => (
                                    <SelectItem key={index} value={province}>{province}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <b>Show {filteredData.length} {filteredData.length === 1 ? "item" : "items"}</b>
                </div>
            </div>
            {filteredData.length > 0 ? (
                <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-4'>
                    {
                        filteredData.map((item) => (
                            <Link href={`restaurant/${item.id}`} key={item.id}>
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
            ) : (
                <div className='flex items-center py-8 flex-col justify-center gap-4'>
                    <motion.div
                        animate={{
                            x: [0, -10, 10, -10, 10, -5, 5, 0],
                        }}
                        transition={{
                            duration: 0.5,
                            ease: "easeInOut"
                        }}
                    >
                        <img src={NF.src} alt="Not Found" className='w-32 translate-x-3' />
                    </motion.div>
                    <p className='font-semibold'>No restaurants found for this province.</p>
                </div>
            )}
        </>
    )
}

export default Grid