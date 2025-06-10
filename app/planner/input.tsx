"use client";

import React, { useState, useEffect } from 'react';
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
import { Brush, Info, MapPin } from 'lucide-react';
import axios from 'axios';
import Triploader from './triploader';
import TextTransition, { presets } from 'react-text-transition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "motion/react";

const TEXTS = [
    'Finding hidden gems...',
    'Crafting your itinerary...',
    'Consulting local guides...',
    'Packing virtual bags...',
    'Mapping your adventure...',
    'Checking the weather...',
    'Discovering local cuisines...',
    'Booking your dream spots...',
    'Translating local phrases...',
    'Almost there...',
    'Unveiling recommendations...',
    'Polishing your plan...'
];

const Tags = [
    "Adventure",
    "Relaxation",
    "Culture",
    "Foodie",
    "Beaches",
    "Mountains",
    "City Exploration",
    "Historical Sites",
    "Nature & Wildlife",
    "Shopping",
    "Nightlife",
    "Luxury",
    "Budget-friendly",
    "Road Trip",
    "Wellness & Spa"
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

type DataStateType = "" | "loading" | TripData;

function TInput() {
    const [showAllTags, setShowAllTags] = useState(false);
    const [Data, setData] = useState<DataStateType>("");
    const [message, setMessage] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [duration, setDuration] = useState("");
    const [groupType, setGroupType] = useState("");
    const [Tindex, setIndex] = React.useState(0);

    useEffect(() => {
        const intervalId = setInterval(
            () => setIndex((index) => index + 1),
            4000,
        );
        return () => clearTimeout(intervalId);
    }, []);

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
            alert("Please fill in the trip description, duration, and group type.");
            return;
        }
        try {
            setData("loading");
            const Res = await axios.post("https://backend.thaiguide.siraphop.me/trip/gen", {
                message: message,
                tag: selectedTags.join(','),
                duration: duration,
                type: groupType
            });
            setData(Res.data);
        } catch (error) {
            console.error("Error fetching trip recommendations:", error);
        }
    }

    const getMotionKey = () => {
        if (Data === "") return "form";
        if (Data === "loading") return "loading";
        if (typeof Data === 'object' && Data !== null) return "results";
        return "empty";
    };

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
                                    <h1 className='font-semibold text-xl'>Tell us about your trip</h1>
                                    <p className='mt-1'>Help us recommend the best activities for you</p>
                                </div>
                                <Textarea
                                    placeholder="e.g., I'm looking for a mix of cultural experiences and relaxing beaches. I'm interested in temples, local markets, and snorkeling."
                                    className='mt-2'
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <div className='grid grid-cols-2 gap-4 mt-3'>
                                    <div>
                                        <p className='mb-2'>Duration</p>
                                        <Input
                                            placeholder='eg. 2 Days, 1 Week'
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <p className='mb-2'>Group Type</p>
                                        <Select value={groupType} onValueChange={setGroupType}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Select group type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Default">Select group type</SelectItem>
                                                <SelectItem value="solo">Solo</SelectItem>
                                                <SelectItem value="couple">Couple</SelectItem>
                                                <SelectItem value="family">Family</SelectItem>
                                                <SelectItem value="friends">Friends</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    <p>Tags</p>
                                    <div className='grid grid-cols-3 md:grid-cols-6 gap-6 mt-3'>
                                        {
                                            displayedTags.map((tag, index) => (
                                                <div key={index} className='flex items-center gap-2'>
                                                    <Checkbox
                                                        id={tag}
                                                        checked={selectedTags.includes(tag)}
                                                        onCheckedChange={(checked) => handleTagChange(tag, checked)}
                                                    />
                                                    <label htmlFor={tag} className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>{tag}</label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {Tags.length > 8 && (
                                        <button
                                            onClick={() => setShowAllTags(!showAllTags)}
                                            className="mt-4 text-[#f7740a] cursor-pointer"
                                        >
                                            {showAllTags ? "Show Less" : `Show Tags More (${Tags.length - 8} more)`}
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={GenAI}
                                    className='bg-[#f7740a] w-full py-2 text-white rounded-xl mt-6 flex items-center justify-center gap-2 cursor-pointer hover:bg-[#e06809] transition-colors'
                                >
                                    <p className='font-semibold'>Get Recommendations</p>
                                    <Brush />
                                </button>
                            </div>
                        </> : <>
                            {
                                Data == "loading" ? <>
                                    <div className='flex items-center justify-center py-12 flex-col gap-4'>
                                        <Triploader />
                                        <TextTransition springConfig={presets.wobbly}><p className='font-semibold text-xl'>{TEXTS[Tindex % TEXTS.length]}</p></TextTransition>
                                    </div>
                                </> : <>
                                    {typeof Data === 'object' && Data !== null && (
                                        <div className='mt-6'>
                                            <h1 className='font-semibold text-xl mb-1'>{Data.tripTitle}</h1>
                                            <p>{Data.description}</p>
                                            <Tabs defaultValue="activities" className='mt-2'>
                                                <TabsList className='w-full'>
                                                    <TabsTrigger value="activities" className='cursor-pointer'>Activities</TabsTrigger>
                                                    <TabsTrigger value="foods" className='cursor-pointer'>Food</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="activities" className='-mt-2'>
                                                    <div className='flex flex-col gap-8 mt-4'>
                                                        {
                                                            Data.days.map((day, index) => (
                                                                <div key={index} className='border-l-2 border-[#f7740a] rounded-l-xl pl-4 p-2'>
                                                                    <h1 className='font-semibold flex items-center gap-2'><MapPin className='text-[#f7740a]' /> Day {day.day}: {day.location}</h1>
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
                                                                    <p className='flex items-center gap-2 mt-2'><Info className='text-[#f7740a]' /> Tips : {day.tips}</p>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </TabsContent>
                                                <TabsContent value="foods" className='-mt-2'>
                                                    <div className='flex flex-col gap-8 mt-4'>
                                                        {
                                                            Data.days.map((day, index) => (
                                                                <div key={index} className='border-l-2 border-[#f7740a] rounded-l-xl pl-4 p-2'>
                                                                    <h1 className='font-semibold flex items-center gap-2'><MapPin className='text-[#f7740a]' /> Day {day.day}: {day.location}</h1>
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
                                        </div>
                                    )}
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