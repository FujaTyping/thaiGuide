import React from 'react';
import NB from "@/assets/media/redeem/notebook.png";
import TS from "@/assets/media/redeem/tshirt.png";
import TB from "@/assets/media/redeem/bag.webp";
import { Coins } from 'lucide-react';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "ThaiGuide – Redeem"
};

const Data = [
    {
        name: "ThaiGuide Notebook",
        decs: "A stylish notebook to jot down your travel memories and discoveries.",
        image: NB,
        require: "100"
    },
    {
        name: "ThaiGuide T-Shirt",
        decs: "A comfortable and trendy t-shirt to showcase your love for ThaiGuide.",
        image: TS,
        require: "400"
    },
    {
        name: "ThaiGuide Bag",
        decs: "A durable and spacious bag, perfect for carrying your essentials on your adventures.",
        image: TB,
        require: "300"
    }
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
                <div className='grid grid-cols-1I md:grid-cols-3 gap-6 mt-6'>
                    {
                        Data.map((item, index) => (
                            <div key={index} className='flex items-center flex-col place-content-between gap-6 hover:scale-105 transition-all duration-200'>
                                <img src={item.image.src} alt="Product" className='rounded-xl h-62 object-cover' />
                                <div className='bg-[#f7740a] w-full rounded-xl p-4 text-white'>
                                    <h1 className='font-semibold text-xl'>{item.name}</h1>
                                    <p className='mt-1 mb-2'>{item.decs}</p>
                                    <p className='flex justify-end gap-2 font-semibold'><Coins /> {item.require}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </main>
        </>
    )
}

export default page