"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from "@/app/config.json";
import Loader from '../components/loader';
import Link from 'next/link';
import { motion } from "motion/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import NF from "@/assets/media/card/icon/notfound.png";
import { useTranslations } from 'next-intl';

interface RoadtripItem {
    id: string;
    title: string;
    thumnails: string;
    location: string;
    tags: string[];
}

const dTags = [
    "Adventure", "Cultural", "Nature", "Relax", "Food", "Historical",
    "Architecture", "Photography", "Shopping",
    "LocalExperience", "Beach", "Mountain", "City",
    "Village", "Island", "Waterfall", "Temple", "Market", "Nightlife",
    "Festival", "Art", "Music", "Sports", "Wellness", "Family", "Romantic",
    "Budget", "Luxury", "OffTheBeatenPath", "Popular"
];

const ALL_TAGS = "All";

function Grid() {
    const t = useTranslations('RoadTrip');
    const [data, setData] = useState<RoadtripItem[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>(ALL_TAGS);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://${server}/roadtrip`);
                setData(response.data);
            } catch (err) {
                console.error("Error fetching roadtrip:", err);
            }
        };

        fetchData();
    }, []);

    const handleTagChange = (value: string) => {
        setSelectedTag(value);
    };

    const filteredData = data.filter(item => {
        if (selectedTag === ALL_TAGS) return true;
        return item.tags && item.tags.includes(selectedTag);
    });

    if (data.length === 0) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        );
    }

    return (
        <>
            <div className='mt-6 flex flex-col md:flex-row md:items-center place-content-between'>
                <div className='flex items-center gap-2'>
                    <p className='font-semibold'>{t('ttitle')} : </p>
                    <Select onValueChange={handleTagChange} defaultValue={ALL_TAGS}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select a Tag" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_TAGS}>{t('tags.All Tags')}</SelectItem>
                            {
                                dTags.map((tag, index) => (
                                    <SelectItem key={index} value={tag}>{t(`tags.${tag}`)}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <b>{t('show')} {filteredData.length} {t('items')}</b>
                </div>
            </div>
            {filteredData.length > 0 ? (
                <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-4'>
                    {
                        filteredData.map((item, index) => (
                            <motion.div
                                whileHover={{ scale: 1.03, rotate: -1 }}
                                whileTap={{ scale: 0.9 }}
                                className='relative'
                                key={index}
                            >
                                <Link href={`roadtrip/${item.id}`}>
                                    <div
                                        className="w-full h-[350px] md:h-[500px] rounded-4xl overflow-hidden relative"
                                    >
                                        <img className='w-full h-full object-cover' src={item.thumnails} alt={item.title} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#f7740a]/70 via-transparent to-transparent"></div>
                                    </div>
                                    <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white rounded-b-4xl flex flex-col gap-2'>
                                        <h1 className='text-2xl md:text-3xl font-bold pb-3 md:pb-0'>{item.title}</h1>
                                        <p>{item.location}</p>
                                    </div>
                                </Link>
                            </motion.div>
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
                        <img src={NF.src} alt="Icon" className='w-32 translate-x-3' />
                    </motion.div>
                    <p className='font-semibold'>{t('notfound')}</p>
                </div>
            )}
        </>
    );
}

export default Grid;