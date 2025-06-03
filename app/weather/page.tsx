import React from 'react';
import Embed from './embed';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ThaiGuide – Weather and Temperature"
};

function Page() {
    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>Weather and Temperature</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>Thailand is located in the tropics near the equator, making the {"country's"} climate hot and humid. The average temperature throughout the country is between 18 - 38 degrees Celsius. The summer season lasts about 3 months, with the hottest weather in mid-April. After that, under the influence of the monsoon, Thailand enters the rainy season, which lasts for 6 months, and the winter season, which lasts for 3 months, respectively.</p>
                <div className='mt-12'>
                    <Embed />
                </div>
            </main>
        </>
    )
}

export default Page