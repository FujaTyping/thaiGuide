"use client";

import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Brush, Info, MapPin, RefreshCcw, TriangleAlert } from 'lucide-react';
import axios from 'axios';
import Triploader from './triploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from 'next-intl';
import RotatingText from '@/components/bits/RotatingText/RotatingText';
import { server } from "@/app/config.json"
import { Button } from '@/components/ui/button';
import NF from "@/assets/media/card/icon/notfound.svg";

const TEXTS = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11'
];

const Tags = [
    "Adventure",
    "Cultural",
    "Nature",
    "Relax",
    "Food",
    "Historical",
    "Architecture",
    "Photography",
    "Shopping",
    "LocalExperience",
    "Beach",
    "Mountain",
    "City",
    "Village",
    "Island",
    "Waterfall",
    "Temple",
    "Market",
    "Nightlife",
    "Festival",
    "Art",
    "Music",
    "Sports",
    "Wellness",
    "Family",
    "Romantic",
    "Budget",
    "Luxury",
    "OffTheBeatenPath",
    "Popular",
];

interface Activity {
    title: string;
    time: string;
    description: string;
}

interface DayPlan {
    day: number;
    location: string;
    travelNotes: string;
    activities: Activity[];
    foodRecommendations: string[];
    tips: string;
}

interface TripData {
    tripTitle: string;
    description: string;
    days: DayPlan[];
}

type DataStateType = "" | "loading" | "error" | TripData;

function TInput() {
    const t = useTranslations('Planner');
    const [showAllTags, setShowAllTags] = useState(false);
    const [Data, setData] = useState<DataStateType>("");
    const [message, setMessage] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [duration, setDuration] = useState("");
    const [groupType, setGroupType] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const displayedTags = showAllTags ? Tags : Tags.slice(0, 8);

    const handleTagChange = (tag: string, checked: boolean | 'indeterminate') => {
        if (checked) {
            setSelectedTags((prevTags) => [...prevTags, tag]);
        } else {
            setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
        }
    };

    async function GenAI() {
        if (!message || !duration || !groupType) {
            setShowAlert(true);
            return;
        }
        try {
            setData("loading");
            const Res = await axios.post(`${server}/trip/gen`, {
                message: message,
                tag: selectedTags.join(','),
                duration: duration,
                type: groupType
            });
            setData(Res.data);
        } catch (error) {
            setData("error");
            console.error("Error fetching trip recommendations:", error);
        }
    }

    const getMotionKey = () => {
        if (Data === "") return "form";
        if (Data === "loading") return "loading";
        if (typeof Data === 'object' && Data !== null) return "results";
        return "empty";
    };

    const loadingTexts = TEXTS.map(num => t(`ai.input.eloading.${num}`));

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key={getMotionKey()}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {
                        Data == "" ? <>
                            <div className='mt-6'>
                                <div>
                                    <h1 className='font-semibold text-xl'>{t('ai.title')}</h1>
                                    <p className='mt-1'>{t('ai.decs')}</p>
                                </div>
                                <Textarea
                                    placeholder={`${t('ai.input.placeholder')}`}
                                    className='mt-2'
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <div className='grid grid-cols-2 gap-4 mt-3'>
                                    <div>
                                        <p className='mb-2'>{t('ai.input.duration')}</p>
                                        <Input
                                            placeholder={`${t('ai.input.durationplace')}`}
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <p className='mb-2'>{t('ai.input.type')}</p>
                                        <Select value={groupType} onValueChange={setGroupType}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder={`${t('ai.input.typeholder')}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Default">{t('ai.input.select.0')}</SelectItem>
                                                <SelectItem value="solo">{t('ai.input.select.1')}</SelectItem>
                                                <SelectItem value="couple">{t('ai.input.select.2')}</SelectItem>
                                                <SelectItem value="family">{t('ai.input.select.3')}</SelectItem>
                                                <SelectItem value="friends">{t('ai.input.select.4')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    <p>{t('ai.input.tag')}</p>
                                    <div className='grid grid-cols-3 md:grid-cols-6 gap-6 mt-3'>
                                        {
                                            displayedTags.map((tag, index) => (
                                                <div key={index} className='flex items-center gap-2'>
                                                    <Checkbox
                                                        id={tag}
                                                        checked={selectedTags.includes(tag)}
                                                        onCheckedChange={(checked) => handleTagChange(tag, checked)}
                                                        className='cursor-pointer'
                                                    />
                                                    <label htmlFor={tag} className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'>{t(`ai.input.tags.${tag}`)}</label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {Tags.length > 8 && (
                                        <p
                                            onClick={() => setShowAllTags(!showAllTags)}
                                            className='font-semibold text-primary cursor-pointer dark:text-white mt-4'
                                        >
                                            {showAllTags ? `${t('ai.input.tagless')}` : `${t('ai.input.tagtoggle')} (${Tags.length - 8} ${t('ai.input.tagmore')})`}
                                        </p>
                                    )}
                                </div>
                                {
                                    showAlert && <>
                                        <motion.div
                                            animate={{
                                                x: [0, -10, 10, -10, 10, -5, 5, 0],
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <p className='mt-3 flex items-center gap-2 font-semibold text-primary'>
                                                <TriangleAlert />
                                                {t('ai.input.require')}
                                            </p>
                                        </motion.div>
                                    </>
                                }
                                <div className='flex items-center justify-center flex-col gap-2'>
                                    <Button
                                        onClick={GenAI}
                                        className='mt-6'
                                        disabled
                                    >
                                        <p className='font-semibold'>{t('ai.input.submit')}</p>
                                        <Brush />
                                    </Button>
                                    <p className='font-bold text-primary dark:text-white flex text-base items-center gap-2'><span><Info /></span> {t('ai.unava')}</p>
                                </div>

                            </div>
                        </> : <>
                            {
                                Data == "loading" ? <>
                                    <div className='flex items-center justify-center py-12 flex-col gap-4'>
                                        <Triploader />
                                        <RotatingText
                                            texts={loadingTexts}
                                            mainClassName="w-fit font-semibold text-black overflow-hidden justify-center rounded-lg dark:text-white"
                                            staggerFrom={"first"}
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            exit={{ y: "-120%" }}
                                            staggerDuration={0.03}
                                            splitLevelClassName="overflow-hidden"
                                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                            rotationInterval={5000}
                                        />
                                    </div>
                                </> : <>
                                    {
                                        Data == "error" ? <>
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
                                                <p className='font-semibold'>{t('ai.input.error')}</p>
                                            </div>
                                        </> : <>
                                            {typeof Data === 'object' && Data !== null && (
                                                <div className='mt-6'>
                                                    <h1 className='font-semibold text-xl mb-1'>{Data.tripTitle}</h1>
                                                    <p>{Data.description}</p>
                                                    <Tabs defaultValue="activities" className='mt-2'>
                                                        <TabsList className='w-full'>
                                                            <TabsTrigger value="activities" className='cursor-pointer'>{t('ai.tabs.act')}</TabsTrigger>
                                                            <TabsTrigger value="foods" className='cursor-pointer'>{t('ai.tabs.food')}</TabsTrigger>
                                                        </TabsList>
                                                        <TabsContent value="activities" className='-mt-2'>
                                                            <div className='flex flex-col gap-8 mt-4'>
                                                                {
                                                                    Data.days.map((day, index) => (
                                                                        <div key={index} className='border-l-2 border-primary rounded-l-xl pl-4 p-2'>
                                                                            <h1 className='font-semibold flex items-center gap-2'><MapPin className='text-primary' /> {t('ai.tabs.day')} {day.day}: {day.location}</h1>
                                                                            <p className='mt-1'>{day.travelNotes}</p>
                                                                            <div className='flex flex-col gap-3 mt-2'>
                                                                                {
                                                                                    day.activities.map((activity, actIndex) => (
                                                                                        <div key={actIndex}>
                                                                                            <h1 className='font-semibold'>{actIndex + 1}. {activity.title} {`(${activity.time})`}</h1>
                                                                                            <p>{activity.description}</p>
                                                                                        </div>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                            <p className='flex flex-col md:flex-row md:items-center gap-2 mt-2'><b className='flex items-center gap-2'><Info className='text-primary' /> {t('ai.tabs.tips')} :</b> {day.tips}</p>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </TabsContent>
                                                        <TabsContent value="foods" className='-mt-2'>
                                                            <div className='flex flex-col gap-8 mt-4'>
                                                                {
                                                                    Data.days.map((day, index) => (
                                                                        <div key={index} className='border-l-2 border-primary rounded-l-xl pl-4 p-2'>
                                                                            <h1 className='font-semibold flex items-center gap-2'><MapPin className='text-primary' /> {t('ai.tabs.day')} {day.day}: {day.location}</h1>
                                                                            <p className='mt-1'>{day.travelNotes}</p>
                                                                            <div className='flex flex-col gap-3 mt-2'>
                                                                                {
                                                                                    day.foodRecommendations.map((item, foodIndex) => (
                                                                                        <p key={foodIndex} className='font-semibold'>{foodIndex + 1}. {item}</p>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </TabsContent>
                                                    </Tabs>
                                                    <div className='flex items-center justify-center'>
                                                        <Button
                                                            onClick={GenAI}
                                                            className='bg-primary w-full md:w-fit py-2 px-6 text-white rounded-xl mt-6 flex items-center justify-center gap-2 cursor-pointer transition-colors'
                                                        >
                                                            <p className='font-semibold'>{t('ai.re')}</p>
                                                            <RefreshCcw />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    }
                                </>
                            }
                        </>
                    }
                </motion.div>
            </AnimatePresence>
        </>
    )
}

export default TInput