import React from 'react';
import type { Metadata } from "next";
import TInput from './input';
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
    title: "ThaiGuide – Trip Planner"
};

function page() {
    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl flex items-center gap-4'>Trip Planner <Badge className='text-white bg-[#f7740a]'>Beta</Badge></h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>Plan your perfect trip to Thailand with our intelligent AI Trip Planner. Get personalized itineraries, recommendations, and tips to make your journey unforgettable. Let our AI assist you in discovering the best of Thailand, tailored to your preferences and interests.</p>
                <TInput />
            </main>
        </>
    )
}

export default page