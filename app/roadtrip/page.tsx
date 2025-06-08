import React from 'react';
import type { Metadata } from "next";
import Grid from './grid';

export const metadata: Metadata = {
    title: "ThaiGuide – Road Trip"
};

function page() {
    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>Road Trip</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                    <p className='mt-4'>Explore Thailand like never before with our ultimate road trip guide! Discover hidden gems, local food spots, cultural landmarks, and nature adventures—all in one unforgettable journey. Perfect for travelers seeking authentic Thai experiences.</p>
                </div>
                <Grid />
            </main>
        </>
    )
}

export default page