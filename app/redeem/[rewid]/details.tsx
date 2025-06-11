/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { Coins, LoaderCircle, TriangleAlert } from 'lucide-react';
import axios from 'axios';
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import { server } from "@/app/config.json";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Loader from '@/app/components/loader';
import { motion } from "motion/react";
import RD from "@/assets/media/icon/redeem.png";
import NF from "@/assets/media/card/icon/notfound.png";

function Details({ data }: { data: any }) {
    const [user, setUser] = useState<User | null>(null);
    const [uData, setUData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [transcationState, setTranscationState] = useState("");

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

    async function CRedeem() {
        setTranscationState("loading");
        try {
            const res = await axios.post("https://backend.thaiguide.siraphop.me/transactions/transfer", {
                userid: user?.uid,
                type: "Redeem",
                place: data.name,
                point: `-${data.require}`
            });
            if (res.status === 200 || res.status === 201) {
                setTranscationState("success");
                setTimeout(() => {
                    window.location.reload();
                }, 5000);
            } else {
                setTranscationState("error");
                console.error("Transaction failed with status:", res.status, res.data);
            }
        } catch (error) {
            console.error("Error during redeem transaction:", error);
            setTranscationState("error");
        }
    }

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-6'>
                <div className='flex items-center justify-center'>
                    <img src={data.image} alt="Reward" className='rounded-xl h-[350px] md:h-[450px] object-cover' />
                </div>
                <div>
                    <h1 className='font-bold text-3xl'>{data.name}</h1>
                    <p className='mt-2'>{data.decs}</p>
                    <p className='flex items-center gap-3 mt-2 text-[#f7740a]'><Coins /> <b>Require point :</b> {data.require}</p>
                    {uData ? <>
                        <div className='mt-8'>
                            <p><b>Your points :</b> {uData.point}/{data.require}</p>
                            {parseInt(uData.point) >= parseInt(data.require) ? <>
                                <Dialog>
                                    <DialogTrigger onClick={() => setTranscationState("")} className='bg-[#f7740a] text-white p-2 rounded-xl px-5 mt-2 w-full md:w-fit cursor-pointer'>
                                        Redeem now
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className='text-2xl'>Are you sure to redeem {data.name} ?</DialogTitle>
                                        </DialogHeader>
                                        {
                                            transcationState == "loading" ? <>
                                                <div className='w-full flex items-center justify-center my-8'>
                                                    <Loader />
                                                </div>
                                            </> : <>
                                                {
                                                    transcationState == "error" ? <>
                                                        <div className='flex items-center flex-col justify-center gap-4'>
                                                            <motion.div
                                                                animate={{
                                                                    x: [0, -10, 10, -10, 10, -5, 5, 0],
                                                                }}
                                                                transition={{
                                                                    duration: 0.5,
                                                                    ease: "easeInOut"
                                                                }}
                                                            >
                                                                <img src={NF.src} alt="Not Found" className='w-32 translate-x-3' />
                                                            </motion.div>
                                                            <p className='font-semibold'>Error during redeem transaction.</p>
                                                        </div>
                                                    </> : <>
                                                        {
                                                            transcationState == "success" ? <>
                                                                <div className='flex items-center flex-col justify-center gap-4'>
                                                                    <img src={RD.src} alt="Not Found" className='w-32 translate-x-3' />
                                                                    <p className='font-semibold'>Redeem successfully.</p>
                                                                </div>
                                                            </> : <>
                                                                <p>This action cannot be undone. <b className='text-[#f7740a]'>Confirming will deduct {data.require} points</b> from your account for the reward: {data.name}.</p>
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <button className='p-2 px-5 rounded-xl border-2 cursor-pointer'>
                                                                            Cancel
                                                                        </button>
                                                                    </DialogClose>
                                                                    <button onClick={CRedeem} className='bg-[#f7740a] text-white p-2 px-5 rounded-xl cursor-pointer'>
                                                                        Confirm
                                                                    </button>
                                                                </DialogFooter>
                                                            </>
                                                        }
                                                    </>
                                                }
                                            </>
                                        }
                                    </DialogContent>
                                </Dialog>
                            </> : <>
                                <button className={`bg-[#f7740a] text-white p-2 rounded-xl px-5 mt-2 w-full md:w-fit cursor-not-allowed`}>
                                    You need more points
                                </button>
                            </>}
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
            </div >
        </>
    )
}

export default Details