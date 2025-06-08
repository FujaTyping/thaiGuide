import React from 'react';
import type { Metadata } from "next";
import Grid from './grid';

export const metadata: Metadata = {
    title: "ThaiGuide – Redeem"
};

function page() {
    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>Redeem Reward</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                    <p className='mt-3'>Redeem your travel points for exclusive rewards, local products, discounts, and more. Scan, explore, and claim amazing experiences with ThaiGuide!</p>
                </div>
                <Grid />
            </main>
        </>
    )
}

export default page