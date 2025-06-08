"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import Loader from '../components/loader';
import axios from 'axios';
import { server } from "@/app/config.json";

import NF from "@/assets/media/card/icon/notfound.png";

import PA from "@/assets/media/icon/PA.png";
import PR from "@/assets/media/icon/PR.png";
interface Transaction {
    point: string;
    type: string;
    place: string;
}

function Details() {
    const [user, setUser] = useState<User | null>(null);
    const [transcaton, setTranscaton] = useState<Transaction[] | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const checkUser = await axios.put(`https://${server}/transactions/getbyuser`, {
                    userid: user.uid
                })
                setTranscaton(checkUser.data.transactions);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!user || !transcaton) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        )
    }

    return (
        <>
            <div className='grid grid-cols-1 gap-4 mt-4'>
                {
                    transcaton.length == 0 ? <>
                        <div className='flex items-center flex-col justify-center py-8 gap-4'>
                            <img src={NF.src} alt="Icon" className='w-28 translate-x-3' />
                            <p className='font-semibold'>There is no transaction</p>
                        </div>
                    </> : <>
                        {
                            transcaton.map((item, index: number) => (
                                <div key={index} className='flex items-center place-content-between'>
                                    <div className='flex items-center gap-3'>
                                        {
                                            item.point.includes("-") ? <>
                                                <img className='w-18' src={PR.src} alt="Icon" />
                                            </> : <>
                                                <img className='w-18' src={PA.src} alt="Icon" />
                                            </>
                                        }
                                        <div>
                                            <p className='font-semibold text-lg'>{item.type}</p>
                                            <p>{item.place}</p>
                                        </div>
                                    </div>
                                    <p className='font-semibold text-lg'>{item.point}</p>
                                </div>
                            ))
                        }
                    </>
                }
            </div>
        </>
    )
}

export default Details