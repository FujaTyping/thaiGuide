/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { Coins, Info, LoaderCircle, MapPin, ScanLine } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import BarcodeScanner from "react-qr-barcode-scanner";
import Loader from '../components/loader';
import axios from "axios";
import { useTranslations } from 'next-intl';

import NF from "@/assets/media/card/icon/notfound.svg";
import LC from "@/assets/media/card/icon/locationcorrect.svg";
import NL from "@/assets/media/card/icon/noaccess.svg";
import { User, onAuthStateChanged } from "firebase/auth";
import AH from "@/assets/media/card/icon/login.svg";
import auth from "@/lib/firebaseAuth";
import { server } from "@/app/config.json";
import { AnimatePresence, motion } from "motion/react";
import ConfettiExplosion from 'react-confetti-explosion';
import STK from "@/assets/media/icon/fire.gif";
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import BadgeRev from "@/assets/media/icon/REV.svg";
import LMT from "@/assets/media/icon/Limit.svg";

function Qr() {
    const t = useTranslations('Profile');
    const [data, setData] = useState("");
    const [codeData, setCodeData] = useState<any>("");
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isWithinRadius, setIsWithinRadius] = useState(false);
    const [succState, setSuccState] = useState(1);
    const [sameSpot, setSameSpot] = useState(false);

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

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setLocationLoading(false);
                },
                (error) => {
                    setLocationLoading(false);
                    setError(error.message);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser');
        }
    }, []);

    async function checkCode(code: string) {
        try {
            if (location) {
                const response = await axios.put(`${server}/code/getbyid`, {
                    id: code,
                    uid: user?.uid,
                    year: new Date().getFullYear(),
                    location
                });

                const resD = response.data;
                setIsWithinRadius(resD != "NNL");
                setSameSpot(resD.samespot);
                setCodeData(resD);
            }
        } catch (error) {
            console.error("Error checking code:", error);
            setCodeData("error");
        }
    }

    return (
        <>
            <div className='fixed bottom-0 right-0 p-4'>
                {locationLoading ? <div className='bg-primary text-white p-3 rounded-full hover:bg-white hover:text-primary border-2 border-primary transition-all duration-250'>
                    <LoaderCircle className='animate-spin size-8' />
                </div> : <Dialog>
                    <DialogTrigger onClick={() => { setData(""); setCodeData(""); setSuccState(1); }}><div className='bg-primary cursor-pointer text-white p-3 rounded-full hover:bg-white hover:text-primary border-2 border-primary transition-all duration-250'>
                        <ScanLine className='size-8' />
                    </div></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className='text-2xl'>{t('scan.title')}</DialogTitle>
                            <p className='mb-4'>{t('scan.decs')}</p>
                            {
                                data == "" ? <>
                                    {
                                        !error ? <>
                                            {
                                                user ? <>
                                                    <div className='rounded-2xl'>
                                                        <BarcodeScanner
                                                            width={500}
                                                            height={400}
                                                            onUpdate={(err, result: any) => {
                                                                if (result) {
                                                                    setData(result.text);
                                                                    checkCode(result.text);
                                                                } else {
                                                                    setData("")
                                                                };
                                                            }}
                                                        />
                                                        <p>{data}</p>
                                                    </div>
                                                    <p className='flex items-center justify-center mt-2 text-primary font-semibold'>{data == "" ? <span className='flex items-center gap-2'><LoaderCircle className='animate-spin' />  {t('scan.loading')}</span> : <span className='text-center'>{data}</span>}</p>
                                                </> : <>
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
                                                            <img src={AH.src} alt="Icon" className='w-32 translate-x-3' />
                                                        </motion.div>
                                                        <p className='font-semibold'>{t('scan.plbrp')}</p>
                                                    </div>
                                                </>
                                            }
                                        </> : <>
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
                                                    <img src={NL.src} alt="Icon" className='w-32' />
                                                </motion.div>
                                                <p className='font-semibold'>{t('scan.pgls')} {`(${error})`}</p>
                                            </div>
                                        </>
                                    }
                                </> :
                                    <>
                                        {
                                            codeData == "" ?
                                                <>
                                                    <div className='w-full flex items-center justify-center my-8'>
                                                        <Loader />
                                                    </div>
                                                </> :
                                                <>
                                                    {
                                                        codeData === "error" ? <>
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
                                                                    <img src={NF.src} alt="Icon" className='w-32 translate-x-3' />
                                                                </motion.div>
                                                                <p className='font-semibold'>{t('scan.llnavqr')}</p>
                                                            </div>
                                                        </> : <>
                                                            {
                                                                codeData.otpp == true ? <>
                                                                    <div className='flex items-center flex-col justify-center'>
                                                                        <img src={LMT.src} alt="Icon" className='w-32' />
                                                                        <p className='font-semibold'>{codeData.name} {t('scan.limit')}</p>
                                                                    </div>
                                                                </> :
                                                                    <>
                                                                        {
                                                                            isWithinRadius ? <>
                                                                                <div>
                                                                                    <AnimatePresence mode="wait">
                                                                                        <motion.div
                                                                                            key={succState}
                                                                                            initial={{ x: 10, opacity: 0 }}
                                                                                            animate={{ x: 0, opacity: 1 }}
                                                                                            exit={{ x: -10, opacity: 0 }}
                                                                                            transition={{
                                                                                                type: "spring",
                                                                                                stiffness: 300,
                                                                                                damping: 30,
                                                                                            }}
                                                                                            className='flex items-center flex-col justify-center gap-4'
                                                                                        >
                                                                                            {
                                                                                                succState == 1 && <>
                                                                                                    <ConfettiExplosion colors={['#ff577f', '#ff884b', '#ffd384', '#fff9b0']} zIndex={99} />
                                                                                                    <img src={LC.src} alt="Location Correct Icon" className='w-32 translate-x-3' />
                                                                                                    <div className='font-semibold'>
                                                                                                        <p className='flex items-center gap-2'><MapPin /> {codeData.name}</p>
                                                                                                        <p className='flex items-center gap-2 text-primary mt-1'><Coins /> {t('scan.pe')} : +{codeData.points}</p>
                                                                                                        {sameSpot && (<p className='flex items-center justify-center mt-4 gap-2'>
                                                                                                            <Tooltip>
                                                                                                                <TooltipTrigger>
                                                                                                                    <Info size={18} />
                                                                                                                </TooltipTrigger>
                                                                                                                <TooltipContent>
                                                                                                                    <p>{t('scan.sametip')}</p>
                                                                                                                </TooltipContent>
                                                                                                            </Tooltip>
                                                                                                            {t('scan.samemssg')}</p>)}
                                                                                                    </div>
                                                                                                    <Button onClick={() => { if (codeData.reciveNewBadge) { setSuccState(succState + 1); const NEWBGD = new Audio('/audio/BadgeRev.mp3'); NEWBGD.volume = 0.5; NEWBGD.play(); } else { setSuccState(3) } }} className='bg-primary text-white hover:bg-primary w-full mt-2 cursor-pointer'>{t('scan.next')}</Button>
                                                                                                </>
                                                                                            }
                                                                                            {
                                                                                                codeData.reciveNewBadge == true && succState == 2 && <>
                                                                                                    <div className='flex items-center justify-center py-4'>
                                                                                                        <img src={BadgeRev.src} alt="Bg" className='w-52 absolute -mr-4 rotate-center opacity-70' />
                                                                                                        <motion.div
                                                                                                            initial={{ opacity: 0, scale: 0 }}
                                                                                                            animate={{ opacity: 1, scale: 1 }}
                                                                                                            transition={{
                                                                                                                duration: 0.6,
                                                                                                                scale: { type: "spring", visualDuration: 0.6, bounce: 0.7 },
                                                                                                            }}
                                                                                                        >
                                                                                                            <img src={codeData.badge.imageUrl} alt="Badge Icon" className='w-36 translate-x-3' />
                                                                                                        </motion.div>
                                                                                                    </div>
                                                                                                    <div className='font-semibold'>
                                                                                                        <p className='flex items-center gap-2'>{t('badge.new')}</p>
                                                                                                        <p className='flex items-center gap-2 text-primary mt-1'><MapPin /> {codeData.badge.province.charAt(0).toUpperCase() + codeData.badge.province.slice(1)}</p>
                                                                                                    </div>
                                                                                                    <Button onClick={() => setSuccState(succState + 1)} className='bg-primary text-white hover:bg-primary w-full mt-2 cursor-pointer'>{t('scan.next')}</Button>
                                                                                                </>
                                                                                            }
                                                                                            {
                                                                                                succState == 3 && <>
                                                                                                    <>
                                                                                                        <img src={STK.src} alt="Location Correct Icon" className='w-32 translate-x-3' />
                                                                                                        <div className='text-center'>
                                                                                                            <h1 className='font-semibold text-xl'>{t("scan.stk")} : {codeData.streak}</h1>
                                                                                                            <p className='mt-1'>{codeData.streak == 1 ? <>{t('scan.stk1')}</> : <>{t('scan.stk2')}</>} : <b>{codeData.streakYRS}</b></p>
                                                                                                        </div>
                                                                                                    </>
                                                                                                </>
                                                                                            }
                                                                                        </motion.div>
                                                                                    </AnimatePresence>
                                                                                </div>
                                                                            </> :
                                                                                <>
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
                                                                                            <img src={NL.src} alt="Icon" className='w-32' />
                                                                                        </motion.div>
                                                                                        <p className='font-semibold'>{t('scan.pgctqrl')}</p>
                                                                                    </div>
                                                                                </>
                                                                        }
                                                                    </>
                                                            }
                                                        </>
                                                    }
                                                </>
                                        }
                                    </>
                            }
                        </DialogHeader>
                    </DialogContent>
                </Dialog>}
            </div>
        </>
    )
}

export default Qr