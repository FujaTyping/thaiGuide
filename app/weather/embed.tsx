"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';
import Loader from './loader';
import { MapPin } from 'lucide-react';
import NF from "@/assets/media/card/icon/notfound.png";
import { motion } from "motion/react";
import dayjs from 'dayjs';
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslations } from 'next-intl';

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

interface AccuWeatherHeadline {
    Text: string;
}

interface AccuWeatherTemperatureValue {
    Value: number;
    Unit: string;
}

interface AccuWeatherTemperature {
    Minimum: AccuWeatherTemperatureValue;
    Maximum: AccuWeatherTemperatureValue;
}

interface AccuWeatherDayNightDetails {
    IconUrl: string;
    IconPhrase: string;
    PrecipitationIntensity?: string;
}

interface AccuWeatherDailyForecast {
    Date: string;
    Temperature: AccuWeatherTemperature;
    Day: AccuWeatherDayNightDetails;
}

interface AccuWeatherData {
    Headline: AccuWeatherHeadline;
    DailyForecasts: AccuWeatherDailyForecast[];
}

function Embed() {
    const t = useTranslations('WeaATem');
    const [dAccu, setDAccu] = useState<AccuWeatherData | null>(null);
    const [loadingAccuWeather, setLoadingAccuWeather] = useState<boolean>(true);
    const [errorAccuWeather, setErrorAccuWeather] = useState<string | null>(null);
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("songkhla")

    useEffect(() => {
        const fetchAccuWeatherData = async () => {
            if (!value) {
                setDAccu(null);
                return;
            }

            setLoadingAccuWeather(true);
            setErrorAccuWeather(null);
            setDAccu(null);

            try {
                const res = await axios.put<AccuWeatherData>(
                    "https://backend.thaiguide.siraphop.me/weather/accu",
                    { province: value }
                );
                setDAccu(res.data);
            } catch (error) {
                console.error("Error fetching AccuWeather data:", error);
                setErrorAccuWeather("Failed to fetch weather data. Please try again.");
            } finally {
                setLoadingAccuWeather(false);
            }
        };

        fetchAccuWeatherData();
    }, [value]);

    const iframeSrc = `https://www.tmd.go.th/en/weatherForecast7DaysWidget?province=${value}`;
    return (
        <>
            <div className='mb-4 flex flex-col md:flex-row place-content-between md:items-center gap-3'>
                <div className='flex items-center gap-3'>
                    <h1>{t('selecttext')} : </h1>
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
                                                    setValue(currentValue === value ? "" : currentValue)
                                                    setOpen(false)
                                                }}
                                            >
                                                <CheckIcon
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === framework.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {framework.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <Tabs defaultValue="ffst">
                <TabsList className="w-full">
                    <TabsTrigger value="ffst">{t('tab.thai')}</TabsTrigger>
                    <TabsTrigger value="tnd">{t('tab.accu')}</TabsTrigger>
                </TabsList>
                <TabsContent value="ffst">
                    <iframe src={iframeSrc} height="400" className='w-full border-0' scrolling="no" title={`Weather forecast for ${value}`}></iframe>
                </TabsContent>
                <TabsContent value="tnd">
                    {loadingAccuWeather && <>
                        <div className='flex items-center justify-center'>
                            <Loader />
                        </div>
                    </>}
                    {errorAccuWeather && !loadingAccuWeather &&
                        <div className='flex items-center flex-col justify-center py-8 gap-4'>
                            <motion.div
                                animate={{
                                    x: [0, -10, 10, -10, 10, -5, 5, 0],
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut"
                                }}
                            >
                                <img src={NF.src} alt="Icon" className='w-28 translate-x-3' />
                            </motion.div>
                            <p className='font-semibold'>{errorAccuWeather}</p>
                        </div>
                    }
                    {dAccu && !loadingAccuWeather && !errorAccuWeather && (
                        <div className='mt-1'>
                            <div>
                                <h1 className='font-semibold text-2xl'>Today, {dAccu.Headline.Text}</h1>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 mt-2"><MapPin className='text-[#f7740a]' /> {value}</h3>
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-3'>
                                {
                                    dAccu.DailyForecasts.map((day, index) => (
                                        <div key={index} className='flex flex-col justify-center items-center gap-1 py-6 px-2 border-[#f7740a] border-3 rounded-xl'>
                                            <h1 className='font-semibold'>{dayjs(day.Date).format("ddd, MMM D")}</h1>
                                            <img className='size-12 object-cover' src={day.Day.IconUrl} alt="Icon" />
                                            <h1 className='text-lg font-semibold'>{day.Temperature.Minimum.Value}{day.Temperature.Minimum.Unit} - {day.Temperature.Maximum.Value}{day.Temperature.Maximum.Unit}</h1>
                                            <h1 className='text-lg font-semibold'>{day.Day.IconPhrase}</h1>
                                            <p>Intensity : {day.Day.PrecipitationIntensity}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                    {!dAccu && !loadingAccuWeather && !errorAccuWeather && value && (
                        <div className='flex items-center flex-col justify-center py-8 gap-4'>
                            <motion.div
                                animate={{
                                    x: [0, -10, 10, -10, 10, -5, 5, 0],
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut"
                                }}
                            >
                                <img src={NF.src} alt="Icon" className='w-28 translate-x-3' />
                            </motion.div>
                            <p className='font-semibold'>No AccuWeather data to display for {value}.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </>
    )
}

export default Embed