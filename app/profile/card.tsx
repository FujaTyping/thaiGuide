/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import Atropos from 'atropos/react';
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import { Coins, Flame } from 'lucide-react';
import Loader from '../components/loader';
import axios from 'axios';
import { server } from "@/app/config.json";
import { useTranslations } from 'next-intl';

// Background
import B1 from "@/assets/media/card/1.jpg";
import B2 from "@/assets/media/card/2.jpg";
import B3 from "@/assets/media/card/3.jpg";
import B4 from "@/assets/media/card/4.jpg";
import B5 from "@/assets/media/card/5.jpg";
import B6 from "@/assets/media/card/6.jpg";

const backgrounds = [B1, B2, B3, B4, B5, B6];

function Card() {
    const t = useTranslations('Profile');
    const [user, setUser] = useState<User | null>(null);
    const [uData, setUData] = useState<any | null>(null);
    const [selectedBackground, setSelectedBackground] = useState(backgrounds[0]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const checkUser = await axios.post(`https://${server}/user`, {
                    userid: user.uid,
                    name: user.displayName,
                    pfp: user.photoURL
                })
                setUData(checkUser.data);
            } else {
                setUser(null);
            }
        });

        const randomIndex = Math.floor(Math.random() * backgrounds.length);
        setSelectedBackground(backgrounds[randomIndex]);

        return () => unsubscribe();
    }, []);

    if (!user || !uData) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        )
    }

    const formatUid = (uid: string) => {
        if (!uid) return '';
        const trimmedUid = uid.slice(0, -5);
        return trimmedUid.replace(/(.{3})/g, '$1-').replace(/-$/, '');
    };

    const displayUid = formatUid(user.uid);

    return (
        <>
            <Atropos className='my-8'>
                <div
                    className='relative overflow-hidden rounded-4xl'
                >
                    <img src={selectedBackground.src} className='w-full h-[400px] object-cover' alt="Card Background" />
                    <div className='absolute top-0 right-0 p-4 text-white'>
                        <p className='text-2xl font-semibold flex items-center gap-2'><Coins /> {uData.point}</p>
                        <p className='text-2xl font-semibold flex items-center gap-2'><Flame /> {uData.streak || 0}</p>
                    </div>
                    <div className='absolute h-48 bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#f7740a]/70 to-transparent'></div>
                    <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white rounded-4xl'>
                        <div className='mb-6 flex flex-col gap-2'>
                            <img src={`${user.photoURL}`} alt="Profile" className='w-28 rounded-full' />
                            <div>
                                <h1 className='text-3xl md:text-4xl font-bold mb-2'>{user.displayName}</h1>
                                <h2 className='font-semibold'>{t('cip')} : {uData.checkin}</h2>
                            </div>
                        </div>
                        <p className='text-sm'>{displayUid}</p>
                    </div>
                </div>
            </Atropos>
        </>
    )
}

export default Card