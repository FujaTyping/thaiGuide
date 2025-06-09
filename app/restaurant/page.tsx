import React from 'react';
import type { Metadata } from "next";
import Grid from './grid';
import { Flame, Leaf, UtensilsCrossed } from 'lucide-react';

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
                <p className='mt-4'>{"Discover the vibrant flavors of Thailand right here. Our restaurant page is your guide to the most authentic and delicious Thai culinary experiences. From street food staples to fine dining, explore a curated list of restaurants, browse menus, and find your next favorite Thai dish. Whether you're a seasoned Thai food lover or new to its delights, let us help you navigate the rich and diverse world of Thai cuisine."}</p>
                <Grid />
            </main>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>Food Tips</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
                    <div className='border-3 rounded-xl p-4 border-[#f7740a]'>
                        <h1 className='text-xl font-semibold mb-2 flex items-center gap-2'><Flame className='text-[#f7740a]' /> Spice Levels</h1>
                        <p>Southern Thai food is typically spicier than other regions. Ask for {`'mai pet' (not spicy)`} if needed.</p>
                    </div>
                    <div className='border-3 rounded-xl p-4 border-[#f7740a]'>
                        <h1 className='text-xl font-semibold mb-2 flex items-center gap-2'><Leaf className='text-[#f7740a]' /> Dietary Restrictions</h1>
                        <p>Vegetarian options available but may contain fish sauce. Say {`'gin jay'`} for strict vegetarian food.</p>
                    </div>
                    <div className='border-3 rounded-xl p-4 border-[#f7740a] md:col-span-2'>
                        <h1 className='text-xl font-semibold mb-2 flex items-center gap-2'><UtensilsCrossed className='text-[#f7740a]' /> Food Etiquette & Cultural Tips</h1>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <h1 className='text-lg font-semibold mb-1'>Dining Etiquette</h1>
                                <div className='ml-4'>
                                    <li>Use a spoon and fork {"(spoon in right hand)"}</li>
                                    <li>{`Don't`} use chopsticks unless eating noodles</li>
                                    <li>Share dishes when eating in groups</li>
                                    <li>{`Don't`} finish everything on your plate</li>
                                    <li>Wait for elders to start eating first</li>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-lg font-semibold mb-1'>Useful Phrases</h1>
                                <div className='ml-4'>
                                    <li>{`"Aroy mak"`} - Very delicious</li>
                                    <li>{`"Mai pet"`} - Not spicy</li>
                                    <li>{`"Gin jay"`} - Vegetarian food</li>
                                    <li>{`"Check bin"`} - Check please</li>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default page