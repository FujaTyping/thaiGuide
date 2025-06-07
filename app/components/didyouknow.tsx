"use client";

import { MessageCircleQuestion } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from "motion/react";

const Data = [
    "Thailand is home to over 1,400 islands, each with its own charm—from party paradise Koh Phangan to tranquil Koh Lipe near Satun, close to Songkhla.",
    "Songkhla is famous for its iconic Golden Mermaid Statue at Samila Beach, inspired by a local folktale and a popular selfie spot for tourists.",
    "Thailand has one of the world’s oldest and largest open-air markets—the Chatuchak Market in Bangkok, with over 15,000 stalls!",
    "Songkhla Old Town blends Chinese, Thai, and Portuguese architecture, offering vibrant street art, cozy cafes, and rich cultural history.",
    "The Great Serpent Nag (Nāga) sculpture in Songkhla is believed to bless visitors with good fortune and prosperity—locals often bring offerings to show respect."
];

function Didyouknow() {
    const [selectedFact, setSelectedFact] = useState<string>("");

    useEffect(() => {
        setSelectedFact(Data[Math.floor(Math.random() * Data.length)]);
    }, []);

    return (
        <>
            <main className='max-w-7xl mx-auto px-3 mb-6'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className='bg-[#f7740a] text-white flex flex-col gap-3 items-center justify-center py-6 rounded-2xl px-4'>
                        <MessageCircleQuestion className='size-8 md:size-10' />
                        <h1 className='font-bold text-2xl md:text-3xl'>Did You Know?</h1>
                        <p className='max-w-3xl'>{selectedFact}</p>
                    </div>
                </motion.div>
            </main>
        </>
    )
}

export default Didyouknow