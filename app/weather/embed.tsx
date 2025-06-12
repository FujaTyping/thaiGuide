"use client";

import React, { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';
import Loader from './loader';
import { MapPin } from 'lucide-react';
import NF from "@/assets/media/card/icon/notfound.png";
import { motion } from "motion/react";
import dayjs from 'dayjs';

const thaiProvinces = [
    "Amnat Charoen", "Ang Thong", "Bangkok", "Bueng Kan", "Buriram", "Chachoengsao",
    "Chai Nat", "Chaiyaphum", "Chanthaburi", "Chiang Mai", "Chiang Rai", "Chonburi",
    "Chumphon", "Kalasin", "Kamphaeng Phet", "Kanchanaburi", "Khon Kaen", "Krabi",
    "Lampang", "Lamphun", "Loei", "Lopburi", "Mae Hong Son", "Maha Sarakham",
    "Mukdahan", "Nakhon Nayok", "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima",
    "Nakhon Sawan", "Nakhon Si Thammarat", "Nan", "Narathiwat", "Nong Bua Lamphu",
    "Nong Khai", "Nonthaburi", "Pathum Thani", "Pattani", "Phang Nga", "Phatthalung",
    "Phayao", "Phetchabun", "Phetchaburi", "Phichit", "Phitsanulok", "Phra Nakhon Si Ayutthaya",
    "Phrae", "Phuket", "Prachinburi", "Prachuap Khiri Khan", "Ranong", "Ratchaburi",
    "Rayong", "Roi Et", "Sa Kaeo", "Sakon Nakhon", "Samut Prakan", "Samut Sakhon",
    "Samut Songkhram", "Saraburi", "Satun", "Sing Buri", "Sisaket", "Songkhla",
    "Sukhothai", "Suphan Buri", "Surat Thani", "Surin", "Tak", "Trang", "Trat",
    "Ubon Ratchathani", "Udon Thani", "Uthai Thani", "Uttaradit", "Yala", "Yasothon"
];

const provinceUrlMap: { [key: string]: string } = {
    "Amnat Charoen": "Amnat Charoen",
    "Ang Thong": "Ang Thong",
    "Bangkok": "Bangkok",
    "Bueng Kan": "Bueng Kan",
    "Buriram": "Buri Ram",
    "Chachoengsao": "Chachoengsao",
    "Chai Nat": "Chai Nat",
    "Chaiyaphum": "Chaiyaphum",
    "Chanthaburi": "Chanthaburi",
    "Chiang Mai": "Chiang Mai",
    "Chiang Rai": "Chiang Rai",
    "Chonburi": "Chon Buri",
    "Chumphon": "Chumphon",
    "Kalasin": "Kalasin",
    "Kamphaeng Phet": "Kamphaeng Phet",
    "Kanchanaburi": "Kanchanaburi",
    "Khon Kaen": "Khon Kaen",
    "Krabi": "Krabi",
    "Lampang": "Lampang",
    "Lamphun": "Lamphun",
    "Loei": "Loei",
    "Lopburi": "Lop Buri",
    "Mae Hong Son": "Mae Hong Son",
    "Maha Sarakham": "Maha Sarakham",
    "Mukdahan": "Mukdahan",
    "Nakhon Nayok": "Nakhon Nayok",
    "Nakhon Pathom": "Nakhon Pathom",
    "Nakhon Phanom": "Nakhon Phanom",
    "Nakhon Ratchasima": "Nakhon Ratchasima",
    "Nakhon Sawan": "Nakhon Sawan",
    "Nakhon Si Thammarat": "Nakhon Si Thammarat",
    "Nan": "Nan",
    "Narathiwat": "Narathiwat",
    "Nong Bua Lamphu": "Nong Bua Lam Phu",
    "Nong Khai": "Nong Khai",
    "Nonthaburi": "Nonthaburi",
    "Pathum Thani": "Pathum Thani",
    "Pattani": "Pattani",
    "Phang Nga": "Phangnga",
    "Phatthalung": "Phatthalung",
    "Phayao": "Phayao",
    "Phetchabun": "Phetchabun",
    "Phetchaburi": "Phetchaburi",
    "Phichit": "Phichit",
    "Phitsanulok": "Phitsanulok",
    "Phra Nakhon Si Ayutthaya": "Phra Nakhon Si Ayutthaya",
    "Phrae": "Phrae",
    "Phuket": "Phuket",
    "Prachinburi": "Prachin Buri",
    "Prachuap Khiri Khan": "Prachuap Khiri Khan",
    "Ranong": "Ranong",
    "Ratchaburi": "Ratchaburi",
    "Rayong": "Rayong",
    "Roi Et": "Roi Et",
    "Sa Kaeo": "Sa Kaeo",
    "Sakon Nakhon": "Sakon Nakhon",
    "Samut Prakan": "Samut Prakan",
    "Samut Sakhon": "Samut Sakhon",
    "Samut Songkhram": "Samut Songkhram",
    "Saraburi": "Saraburi",
    "Satun": "Satun",
    "Sing Buri": "Sing Buri",
    "Sisaket": "Si Sa Ket",
    "Songkhla": "Songkhla",
    "Sukhothai": "Sukhothai",
    "Suphan Buri": "Suphan Buri",
    "Surat Thani": "Surat Thani",
    "Surin": "Surin",
    "Tak": "Tak",
    "Trang": "Trang",
    "Trat": "Trat",
    "Ubon Ratchathani": "Ubon Ratchathani",
    "Udon Thani": "Udon Thani",
    "Uthai Thani": "Uthai Thani",
    "Uttaradit": "Uttaradit",
    "Yala": "Yala",
    "Yasothon": "Yasothon"
};

const formatProvinceForUrl = (provinceName: string): string => {
    const mappedName = provinceUrlMap[provinceName] || provinceName;
    return encodeURIComponent(mappedName);
};
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
    const [selectedProvince, setSelectedProvince] = useState<string>("Songkhla");
    const [dAccu, setDAccu] = useState<AccuWeatherData | null>(null);
    const [loadingAccuWeather, setLoadingAccuWeather] = useState<boolean>(true);
    const [errorAccuWeather, setErrorAccuWeather] = useState<string | null>(null);

    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
    };

    useEffect(() => {
        const fetchAccuWeatherData = async () => {
            if (!selectedProvince) {
                setDAccu(null);
                return;
            }

            setLoadingAccuWeather(true);
            setErrorAccuWeather(null);
            setDAccu(null);

            try {
                const res = await axios.put<AccuWeatherData>(
                    "https://backend.thaiguide.siraphop.me/weather/accu",
                    { province: selectedProvince }
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
    }, [selectedProvince]);

    const iframeSrc = `https://www.tmd.go.th/en/weatherForecast7DaysWidget?province=${formatProvinceForUrl(selectedProvince)}`;
    return (
        <>
            <div className='mb-4 flex flex-col md:flex-row place-content-between md:items-center gap-3'>
                <div className='flex items-center gap-3'>
                    <h1>Province : </h1>
                    <Select onValueChange={handleProvinceChange} value={selectedProvince}>
                        <SelectTrigger className='w-62'>
                            <SelectValue placeholder="Select a Province" />
                        </SelectTrigger>
                        <SelectContent>
                            {thaiProvinces.map((province) => (
                                <SelectItem key={province} value={province}>
                                    {province}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Tabs defaultValue="ffst">
                <TabsList className="w-full">
                    <TabsTrigger value="ffst"><span className='hidden md:block'>Thai</span> Meteorological Department</TabsTrigger>
                    <TabsTrigger value="tnd">AccuWeather</TabsTrigger>
                </TabsList>
                <TabsContent value="ffst">
                    <iframe src={iframeSrc} height="400" className='w-full border-0' scrolling="no" title={`Weather forecast for ${selectedProvince}`}></iframe>
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
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 mt-2"><MapPin className='text-[#f7740a]' /> {selectedProvince}</h3>
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
                    {!dAccu && !loadingAccuWeather && !errorAccuWeather && selectedProvince && (
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
                            <p className='font-semibold'>No AccuWeather data to display for {selectedProvince}.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </>
    )
}

export default Embed