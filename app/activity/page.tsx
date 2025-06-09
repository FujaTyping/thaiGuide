import React from 'react';
import type { Metadata } from "next";
import Grid from './grid';

export const metadata: Metadata = {
    title: "ThaiGuide – Activity and Events"
};

function page() {
    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>Activity and Events</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>
                    Discover a vibrant array of activities and immerse yourself in the exciting events Thailand has to offer. From cultural festivals to adventurous excursions, find your next unforgettable experience here.
                </p>
                <Grid />
            </main>
        </>
    )
}

export default page