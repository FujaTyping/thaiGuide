/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { Coins, Info, LoaderCircle, ShoppingBasket, TriangleAlert } from 'lucide-react';
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
import RD from "@/assets/media/icon/redeem.svg";
import NF from "@/assets/media/card/icon/notfound.svg";
import { useTranslations } from 'next-intl';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import LMIT from "@/assets/media/icon/Limit.svg";

function Details({ data }: { data: any }) {
    const t = useTranslations('Redeem');
    const [user, setUser] = useState<User | null>(null);
    const [uData, setUData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [transcationState, setTranscationState] = useState("");
    const [cusERR, setCusERR] = useState("");
    const [succV, setSuccV] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const checkUser = await axios.post(`${server}/user`, {
                    name: user.displayName,
                    pfp: user.photoURL
                }, {
                    headers: {
                        aetheruid: user.uid
                    }
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
        const payload = {
            type: "Redeem",
            place: data.name,
            point: `-${data.require}`
        } as any;
        if (data.virtual) {
            payload.isV = true;
            payload.vType = data.type;
            payload.attach = data.attach;
        }
        setTranscationState("loading");
        try {
            const res = await axios.post(`${server}/transactions/transfer`, payload, {
                headers: {
                    aetheruid: user?.uid
                }
            });
            setSuccV(res.data.isV);
            setTranscationState("success");
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        } catch (error: any) {
            if (error.response.data) {
                setCusERR(error.response.data);
            }
            setTranscationState("error");
            console.error("Transaction failed with status");
        }
    }

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-6'>
                <div className='flex items-center justify-center'>
                    <PhotoProvider
                        speed={() => 800}
                        easing={(type) => (type === 2 ? 'cubic-bezier(0.36, 0, 0.66, -0.56)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)')}
                        maskOpacity={0.4}
                    >
                        <PhotoView src={data.image}>
                            <img src={data.image} alt="Reward" className='rounded-xl h-[350px] md:h-[450px] object-cover cursor-pointer' />
                        </PhotoView>
                    </PhotoProvider>
                </div>
                <div>
                    <h1 className='font-bold text-3xl'>{data.name}</h1>
                    <p className='mt-2'>{data.decs}</p>
                    {data.virtual && <p className='flex items-center gap-3 mt-2 text-primary'><Info /> <b>{t('items.isV')}</b></p>}
                    <p className='flex items-center gap-3 mt-2 text-primary'><Coins /> <b>{t('items.require')} :</b> {data.require}</p>
                    <p className='flex items-center gap-3 mt-2 text-primary'><ShoppingBasket /> <span className='font-bold'>Quantity</span>: {data.quantity}</p>
                    {uData ? <>
                        <div className='mt-8'>
                            <p><b>{t('items.your')} :</b> {uData.point}/{data.require}</p>
                            {parseInt(uData.point) >= parseInt(data.require) ? <>
                                {
                                    data.quantity != "Unlimited" && parseInt(data.quantity) <= 0 ? <>
                                        <button className={`bg-primary text-white p-2 rounded-xl px-5 mt-2 w-full md:w-fit cursor-not-allowed`}>
                                            {t('items.oos')}
                                        </button>
                                    </> : <button onClick={() => { setTranscationState(""); setConfirmOpen(true); }} className='bg-primary text-white p-2 rounded-xl px-5 mt-2 w-full md:w-fit cursor-pointer'>
                                        {t('items.now')}
                                    </button>
                                }
                            </> : <>
                                <button className={`bg-primary text-white p-2 rounded-xl px-5 mt-2 w-full md:w-fit cursor-not-allowed`}>
                                    {t('items.needed')}
                                </button>
                            </>}
                        </div>
                    </> : <>
                        {
                            user || loading ? <>
                                <div className='mt-8 text-primary flex items-center gap-2'>
                                    <LoaderCircle className='animate-spin' />
                                    <p className='font-semibold'>{t('items.loading')}</p>
                                </div>
                            </> : <>
                                <div className='mt-8 text-primary flex items-center gap-2'>
                                    <TriangleAlert />
                                    <p className='font-semibold'>{t('items.login')}</p>
                                </div>
                            </>
                        }
                    </>}
                </div>
            </div >
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('items.sure')} {data.name} ?</DialogTitle>
                    </DialogHeader>
                    {
                        transcationState == "loading" ? <>
                            <div className='w-full flex items-center justify-center my-8'>
                                <Loader />
                            </div>
                        </> : <>
                            {
                                transcationState == "error" ? <>
                                    {
                                        cusERR == "ITES" ?
                                            <div className='flex items-center flex-col justify-center'>
                                                <img src={LMIT.src} alt="Not Found" className='w-32' />
                                                <p className='font-semibold'>{t('items.limit')}</p>
                                            </div>
                                            :
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
                                                <p className='font-semibold'>{t('items.error')}</p>
                                            </div>
                                    }
                                </> : <>
                                    {
                                        transcationState == "success" ? <>
                                            <div className='flex items-center flex-col justify-center gap-4'>
                                                <img src={RD.src} alt="Not Found" className='w-32 translate-x-3' />
                                                <div className='flex items-center justify-center flex-col'>
                                                    <p className='font-semibold'>{t('items.success')}</p>
                                                    {succV && <p className='font-semibold text-primary mt-1 flex items-center gap-2'><Info /> {t('items.locateProfile')}</p>}
                                                </div>
                                            </div>
                                        </> : <>
                                            <p>{t('items.modal.0')} <b className='text-primary'>{t('items.modal.1')} {data.require} {t('items.modal.2')}</b> {t('items.modal.3')} {data.name}.</p>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <button className='p-2 px-5 rounded-xl border-2 cursor-pointer'>
                                                        {t('items.cancel')}
                                                    </button>
                                                </DialogClose>
                                                <button onClick={CRedeem} className='bg-primary text-white p-2 px-5 rounded-xl cursor-pointer'>
                                                    {t('items.confirm')}
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
        </>
    )
}

export default Details