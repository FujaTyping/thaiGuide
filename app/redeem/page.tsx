import React from 'react';
import type { Metadata } from "next";
import Grid from './grid';

export const metadata: Metadata = {
    title: "ThaiGuide – Redeem"
};

const Data = [
    "Embark on an adventure to one of our partnered tourist destinations. Each location offers unique experiences and opportunities to earn.",
    "Once you arrive, keep an eye out! The special ThaiGuide QR code will be placed in a somewhat random spot within the location. Happy hunting!",
    "Use the ThaiGuide app to scan the QR code you've discovered. Successful scans will instantly add points to your account, bringing you closer to exciting rewards."
]

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
                <div className='mt-12'>
                    <h1 className='font-bold text-4xl'>How to get a point</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                    <p className='mt-3'>Scan a QR code at each tourist location to earn points. Collect points and redeem them for rewards.</p>
                </div>
                <div className='mt-3 flex flex-col gap-4'>
                    {
                        Data.map((item, index) => (
                            <div key={index} className='flex flex-col md:flex-row items-center gap-4'>
                                <div className='text-white bg-[#f7740a] w-fit p-2 px-4 font-bold text-xl rounded-full'>
                                    {index + 1}
                                </div>
                                <p className='font-semibold text-lg'>{item}</p>
                            </div>
                        ))
                    }
                </div>
            </main>
        </>
    )
}

export default page