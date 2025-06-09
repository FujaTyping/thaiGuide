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
import { Brush } from 'lucide-react';

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

function TInput() {
    const [showAllTags, setShowAllTags] = useState(false);
    const displayedTags = showAllTags ? Tags : Tags.slice(0, 8);

    return (
        <>
            <div className='mt-6'>
                <div>
                    <h1 className='font-semibold text-xl'>Tell us about your trip</h1>
                    <p className='mt-1'>Help us recommend the best activities for you</p>
                </div>
                <Textarea placeholder="e.g., I'm looking for a mix of cultural experiences and relaxing beaches. I'm interested in temples, local markets, and snorkeling." className='mt-2' />
                <div className='grid grid-cols-2 gap-4 mt-3'>
                    <div>
                        <p className='mb-2'>Duration</p>
                        <Input placeholder='eg. 2 Days, 1 Week' />
                    </div>
                    <div>
                        <p className='mb-2'>Group Type</p>
                        <Select>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Solo" />
                            </SelectTrigger>
                            <SelectContent>
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
                    <div className='grid grid-cols-6 gap-6 mt-3'>
                        {
                            displayedTags.map((tag, index) => (
                                <div key={index} className='flex items-center gap-2'>
                                    <Checkbox id={tag} />
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
                <button className='bg-[#f7740a] w-full py-2 text-white rounded-xl mt-6 flex items-center justify-center gap-2'>
                    <p className='font-semibold'>Get Recommendations</p>
                    <Brush />
                </button>
            </div>
        </>
    )
}

export default TInput