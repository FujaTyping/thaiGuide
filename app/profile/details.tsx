"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import Loader from '../components/loader';

import PA from "@/assets/media/icon/PA.png";
import PR from "@/assets/media/icon/PR.png";

const HistoryINV = [
    {
        id: "ID001",
        type: "Daily Check-In",
        place: "-",
        point: "+5"
    },
    {
        id: "ID002",
        type: "Scan QR",
        place: "Samila Beach",
        point: "+10"
    },
    {
        id: "ID003",
        type: "Daily Check-In",
        place: "-",
        point: "+5"
    },
    {
        id: "ID004",
        type: "Redeem",
        place: "A Cap",
        point: "-8"
    }
]

function Details() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!user) {
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
                    HistoryINV.map((item, index) => (
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
            </div>
        </>
    )
}

export default Details