"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "motion/react";
import axios from 'axios';
import { server } from "@/app/config.json";
import Loader from '../components/loader';
import Link from 'next/link';
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
import { useTranslations } from 'next-intl';

import NF from "@/assets/media/card/icon/notfound.png";
import { CheckIcon, ChevronDown, ChevronsUpDownIcon } from 'lucide-react';

const Proworks = [
    { value: "amnat charoen", label: "Amnat Charoen" },
    { value: "ang thong", label: "Ang Thong" },
    { value: "bangkok", label: "Bangkok" },
    { value: "bueng kan", label: "Bueng Kan" },
    { value: "buriram", label: "Buriram" },
    { value: "chachoengsao", label: "Chachoengsao" },
    { value: "chai nat", label: "Chai Nat" },
    { value: "chaiyaphum", label: "Chaiyaphum" },
    { value: "chanthaburi", label: "Chanthaburi" },
    { value: "chiang mai", label: "Chiang Mai" },
    { value: "chiang rai", label: "Chiang Rai" },
    { value: "chonburi", label: "Chonburi" },
    { value: "chumphon", label: "Chumphon" },
    { value: "kalasin", label: "Kalasin" },
    { value: "kamphaeng phet", label: "Kamphaeng Phet" },
    { value: "kanchanaburi", label: "Kanchanaburi" },
    { value: "khon kaen", label: "Khon Kaen" },
    { value: "krabi", label: "Krabi" },
    { value: "lampang", label: "Lampang" },
    { value: "lamphun", label: "Lamphun" },
    { value: "loei", label: "Loei" },
    { value: "lopburi", label: "Lopburi" },
    { value: "mae hong son", label: "Mae Hong Son" },
    { value: "maha sarakham", label: "Maha Sarakham" },
    { value: "mukdahan", label: "Mukdahan" },
    { value: "nakhon nayok", label: "Nakhon Nayok" },
    { value: "nakhon pathom", label: "Nakhon Pathom" },
    { value: "nakhon phanom", label: "Nakhon Phanom" },
    { value: "nakhon ratchasima", label: "Nakhon Ratchasima" },
    { value: "nakhon sawan", label: "Nakhon Sawan" },
    { value: "nakhon si thammarat", label: "Nakhon Si Thammarat" },
    { value: "nan", label: "Nan" },
    { value: "narathiwat", label: "Narathiwat" },
    { value: "nong bua lamphu", label: "Nong Bua Lamphu" },
    { value: "nong khai", label: "Nong Khai" },
    { value: "nonthaburi", label: "Nonthaburi" },
    { value: "pathum thani", label: "Pathum Thani" },
    { value: "pattani", label: "Pattani" },
    { value: "phang nga", label: "Phang Nga" },
    { value: "phatthalung", label: "Phatthalung" },
    { value: "phayao", label: "Phayao" },
    { value: "phetchabun", label: "Phetchabun" },
    { value: "phetchaburi", label: "Phetchaburi" },
    { value: "phichit", label: "Phichit" },
    { value: "phitsanulok", label: "Phitsanulok" },
    { value: "phra nakhon si ayutthaya", label: "Phra Nakhon Si Ayutthaya" },
    { value: "phrae", label: "Phrae" },
    { value: "phuket", label: "Phuket" },
    { value: "prachinburi", label: "Prachinburi" },
    { value: "prachuap khiri khan", label: "Prachuap Khiri Khan" },
    { value: "ranong", label: "Ranong" },
    { value: "ratchaburi", label: "Ratchaburi" },
    { value: "rayong", label: "Rayong" },
    { value: "roi et", label: "Roi Et" },
    { value: "sa kaeo", label: "Sa Kaeo" },
    { value: "sakon nakhon", label: "Sakon Nakhon" },
    { value: "samut prakan", label: "Samut Prakan" },
    { value: "samut sakhon", label: "Samut Sakhon" },
    { value: "samut songkhram", label: "Samut Songkhram" },
    { value: "saraburi", label: "Saraburi" },
    { value: "satun", label: "Satun" },
    { value: "songkhla", label: "Songkhla" },
    { value: "sing buri", label: "Sing Buri" },
    { value: "sisaket", label: "Sisaket" },
    { value: "sukhothai", label: "Sukhothai" },
    { value: "suphan buri", label: "Suphan Buri" },
    { value: "surat thani", label: "Surat Thani" },
    { value: "surin", label: "Surin" },
    { value: "tak", label: "Tak" },
    { value: "trang", label: "Trang" },
    { value: "trat", label: "Trat" },
    { value: "ubon ratchathani", label: "Ubon Ratchathani" },
    { value: "udon thani", label: "Udon Thani" },
    { value: "uthai thani", label: "Uthai Thani" },
    { value: "uttaradit", label: "Uttaradit" },
    { value: "yala", label: "Yala" },
    { value: "yasothon", label: "Yasothon" },
]

const ALL_PROVINCES_VALUE = "All";

const INITIAL_ITEMS_TO_SHOW = 12;
const ITEMS_PER_LOAD = 8;

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
    const [numDisplayedItems, setNumDisplayedItems] = useState<number>(INITIAL_ITEMS_TO_SHOW);
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("songkhla");
    const t = useTranslations('Restaurant');
    const p = useTranslations('Province');

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

    const filteredData = data.filter(item => {
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
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-4'>
                        {itemsToDisplay.map((item) => (
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
                        ))}
                    </div>
                    {numDisplayedItems < filteredData.length && (
                        <div className="mt-8 flex items-center justify-center">
                            <button
                                onClick={handleLoadMore}
                                className="flex items-center gap-3 w-full md:w-fit justify-center bg-[#f7740a] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-[#f7640a] cursor-pointer"
                            >
                                <ChevronDown />
                                {t('grid.more')}
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
                    <p className='font-semibold'>{t('grid.notfound')}</p>
                </div>
            )}
        </>
    )
}

export default Grid