import React from 'react';
import type { Metadata } from "next";
import Grid from './grid';

export const metadata: Metadata = {
    title: "ThaiGuide – Restaurant and Food"
};

function page() {
    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>Restaurant and Food</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>Discover the vibrant flavors of Thailand right here. Our restaurant page is your guide to the most authentic and delicious Thai culinary experiences. From street food staples to fine dining, explore a curated list of restaurants, browse menus, and find your next favorite Thai dish. Whether you're a seasoned Thai food lover or new to its delights, let us help you navigate the rich and diverse world of Thai cuisine.</p>
                <Grid />
            </main>
        </>
    )
}

export default page