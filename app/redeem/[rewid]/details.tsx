/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { Coins, LoaderCircle, TriangleAlert } from 'lucide-react';
import axios from 'axios';
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import { server } from "@/app/config.json";

function Details({ data }: { data: any }) {
    const [user, setUser] = useState<User | null>(null);
    const [uData, setUData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const checkUser = await axios.post(`https://${server}/user`, {
                    userid: user.uid,
                    name: user.displayName
                })
                setUData(checkUser.data);
                setLoading(false);
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);
    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-6'>
                <div className='flex items-center justify-center'>
                    <img src={data.image} alt="Reward" className='rounded-xl h-[350px] md:h-[450px]' />
                </div>
                <div>
                    <h1 className='font-bold text-3xl'>{data.name}</h1>
                    <p className='mt-2'>{data.decs}</p>
                    <p className='flex items-center gap-3 mt-2 text-[#f7740a]'><Coins /> <b>Require point :</b> {data.require}</p>
                    {uData ? <>
                        <div className='mt-8'>
                            <p><b>Your points :</b> {uData.point}/{data.require}</p>
                            <button className={`bg-[#f7740a] text-white p-2 rounded-xl px-5 mt-2 w-full md:w-fit ${!(parseInt(uData.point) >= parseInt(data.require)) && "cursor-not-allowed"}`}>
                                {parseInt(uData.point) >= parseInt(data.require) ? <>
                                    Redeem now
                                </> : <>
                                    You need more points
                                </>}
                            </button>
                        </div>
                    </> : <>
                        {
                            user || loading ? <>
                                <div className='mt-8 text-[#f7740a] flex items-center gap-2'>
                                    <LoaderCircle className='animate-spin' />
                                    <p className='font-semibold'>Loading user data</p>
                                </div>
                            </> : <>
                                <div className='mt-8 text-[#f7740a] flex items-center gap-2'>
                                    <TriangleAlert />
                                    <p className='font-semibold'>Please login to redeem reward</p>
                                </div>
                            </>
                        }
                    </>}
                </div>
            </div>
        </>
    )
}

export default Details