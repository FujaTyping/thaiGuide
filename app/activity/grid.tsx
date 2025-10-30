/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from "@/app/config.json";
import Loader from '../components/loader';
import Link from 'next/link';
import { motion } from "motion/react"
import { CheckIcon, ChevronsUpDownIcon, Star } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import NF from "@/assets/media/card/icon/notfound.svg";
import { useTranslations } from 'next-intl';

import Proworks from '@/data/province';
const ALL_PROVINCES_VALUE = "All";

const INITIAL_ITEMS_TO_SHOW = 12;
const ITEMS_PER_LOAD = 8;

interface Activity {
    province: any;
    id: string;
    title: string;
    ndtitle: string;
    location: string;
    decs: string;
    thumnails: string;
    pricing: string;
    rating: number;
    link: string;
}

function Grid() {
    const [Data, setData] = useState<Activity[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>("Songkhla");
    const [loading, setLoading] = useState(true);
    const [numDisplayedItems, setNumDisplayedItems] = useState<number>(INITIAL_ITEMS_TO_SHOW);
    const t = useTranslations('Activities');
    const p = useTranslations('Province');
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("songkhla");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${server}/activities`);
                setData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching activities:", err);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        );
    }

    const filteredData = Data.filter(item => {
        if (selectedProvince === ALL_PROVINCES_VALUE) return true;
        return item.province.toLowerCase() === selectedProvince.toLowerCase();
    });

    const itemsToDisplay = filteredData.slice(0, numDisplayedItems);
    const handleLoadMore = () => {
        setNumDisplayedItems(prevCount => Math.min(prevCount + ITEMS_PER_LOAD, filteredData.length));
    };

    return (
        <>
            <div className='mt-6 flex flex-col md:flex-row md:items-center place-content-between'>
                <div className='flex items-center gap-2'>
                    <p className='font-semibold'>{t('fillter')} : </p>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] justify-between"
                            >
                                {value
                                    ? Proworks.find((framework) => framework.value === value)?.label
                                    : `${t('select.start')}`}
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder={t('select.search')} />
                                <CommandList>
                                    <CommandEmpty>{t('select.notfound')}</CommandEmpty>
                                    <CommandGroup>
                                        {Proworks.map((framework) => (
                                            <CommandItem
                                                key={framework.value}
                                                value={framework.value}
                                                onSelect={(currentValue) => {
                                                    const newPickerValue = currentValue === value ? "" : currentValue;
                                                    setValue(newPickerValue);

                                                    if (newPickerValue === "") {
                                                        setSelectedProvince(ALL_PROVINCES_VALUE);
                                                    } else {
                                                        const selectedFramework = Proworks.find(fw => fw.value === newPickerValue);
                                                        if (selectedFramework) {
                                                            setSelectedProvince(selectedFramework.label);
                                                        } else {
                                                            setSelectedProvince(ALL_PROVINCES_VALUE);
                                                        }
                                                    }
                                                    setOpen(false);
                                                }}
                                            >
                                                <CheckIcon
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === framework.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {p(`${framework.value}`)}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <b>{t('show')} {filteredData.length} {t('items')}</b>
                </div>
            </div>
            {filteredData.length > 0 ? (
                <>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-6'>
                        {
                            itemsToDisplay.map((item) => (
                                <Link href={`activity/${item.id}`} key={item.id}>
                                    <motion.div
                                        whileHover={{ scale: 1.03, rotate: -1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className='relative'
                                    >
                                        <div
                                            className="w-full h-[350px] md:h-[500px] rounded-4xl overflow-hidden relative"
                                        >
                                            <img className='w-full h-full object-cover' src={item.thumnails} alt={item.title} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent"></div>
                                        </div>
                                        <div className='absolute top-0 right-0 p-4 md:p-8 text-white rounded-b-4xl flex gap-2 items-center'>
                                            <Star />
                                            <p className='font-semibold'>{item.rating}</p>
                                        </div>
                                        <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white rounded-b-4xl flex flex-col gap-2'>
                                            <h1 className='text-2xl md:text-3xl font-bold pb-3 md:pb-0'>{item.title}</h1>
                                            <p className='hidden md:block'>{item.location}</p>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))
                        }
                    </div>
                    {numDisplayedItems < filteredData.length && (
                        <div className="mt-8 flex items-center justify-center">
                            <button
                                onClick={handleLoadMore}
                                className="flex items-center gap-3 w-full md:w-fit justify-center bg-primary text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-[#f7640a] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                            >
                                <ChevronDown />
                                {t('more')}
                            </button>
                        </div>
                    )}
                </>
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
                    <p className='font-semibold'>{t('notfound')}</p>
                </div>
            )}
        </>
    )
}

export default Grid