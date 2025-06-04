"use client";

import React, { useState, useEffect } from 'react';
import Atropos from 'atropos/react';
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import { Coins } from 'lucide-react';
import Loader from '../components/loader';

// Background
import B1 from "@/assets/media/card/1.jpg";
import B2 from "@/assets/media/card/2.jpg";
import B3 from "@/assets/media/card/3.jpg";
import B4 from "@/assets/media/card/4.jpg";

const backgrounds = [B1, B2, B3, B4];

function Card() {
    const [user, setUser] = useState<User | null>(null);
    const [selectedBackground, setSelectedBackground] = useState(backgrounds[0]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        const randomIndex = Math.floor(Math.random() * backgrounds.length);
        setSelectedBackground(backgrounds[randomIndex]);

        return () => unsubscribe();
    }, []);

    if (!user) {
        return (
            <div className='w-full flex items-center justify-center mt-12'>
                <Loader />
            </div>
        )
    }

    return (
        <>
            <Atropos className='mt-12'>
                <div
                    className='relative overflow-hidden rounded-4xl'
                >
                    <img src={selectedBackground.src} className='w-full h-[400px] object-cover' alt="Card Background" />
                    <div className='absolute top-0 right-0 p-4 text-white'>
                        <p className='text-2xl font-semibold flex items-center gap-2'><Coins /> 0</p>
                    </div>
                    <div className='absolute h-48 bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#f7740a]/70 to-transparent'></div>
                    <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white rounded-4xl'>
                        <div className='mb-6 flex flex-col gap-2'>
                            <img src={`${user.photoURL}`} alt="Profile" className='w-28 rounded-full' />
                            <div>
                                <h1 className='text-3xl md:text-4xl font-bold mb-2'>{user.displayName}</h1>
                                <h2 className='font-semibold'>Days in Thailand : 0</h2>
                            </div>
                        </div>
                        <p className='text-sm'>{user.uid}</p>
                    </div>
                </div>
            </Atropos>
        </>
    )
}

export default Card