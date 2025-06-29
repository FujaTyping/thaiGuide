/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { Coins, LoaderCircle, MapPin, ScanLine } from 'lucide-react';
import React, { useState, useEffect } from 'react'; import {
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

import NF from "@/assets/media/card/icon/notfound.png";
import LC from "@/assets/media/card/icon/locationcorrect.png";
import NL from "@/assets/media/card/icon/noaccess.png";
import { User, onAuthStateChanged } from "firebase/auth";
import AH from "@/assets/media/card/icon/login.png";
import auth from "@/lib/firebaseAuth";
import { getDistance } from 'geolib';
import { server } from "@/app/config.json";
import { motion } from "motion/react";
import ConfettiExplosion from 'react-confetti-explosion';
interface ApiCodeData {
    name: string;
    points: number;
    location: {
        latitude: number;
        longitude: number;
    };
}

function Qr() {
    const t = useTranslations('Profile');
    const [data, setData] = useState("");
    const [codeData, setCodeData] = useState<ApiCodeData | "error" | "">("");
    const [location, setLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [locationLoading, setLocationLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isWithinRadius, setIsWithinRadius] = useState(false);

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
            const response = await axios.put(`https://${server}/code/getbyid`, {
                id: code
            });

            const resD = response.data

            if (location) {
                const distanceInMeters = getDistance(
                    { latitude: location.latitude, longitude: location.longitude },
                    { latitude: resD.location.latitude, longitude: resD.location.longitude }
                );
                const distanceInKm = distanceInMeters / 1000;
                console.log(distanceInKm);
                setIsWithinRadius(distanceInKm <= 2);
                if (distanceInKm <= 2) {
                    await axios.post(`https://${server}/transactions/transfer`, {
                        userid: user?.uid,
                        type: "Scan QR",
                        place: resD.name,
                        point: `+${resD.points}`
                    })
                }
            }

            setCodeData(resD);
        } catch (error) {
            console.error("Error checking code:", error);
            setCodeData("error");
        }
    }

    return (
        <>
            <div className='fixed bottom-0 right-0 p-4'>
                {locationLoading ? <div className='bg-[#f7740a] text-white p-3 rounded-full hover:bg-white hover:text-[#f7740a] border-2 border-[#f7740a] transition-all duration-250'>
                    <LoaderCircle className='animate-spin size-8' />
                </div> : <Dialog>
                    <DialogTrigger onClick={() => { setData(""); setCodeData(""); }}><div className='bg-[#f7740a] cursor-pointer text-white p-3 rounded-full hover:bg-white hover:text-[#f7740a] border-2 border-[#f7740a] transition-all duration-250'>
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
                                                    <p className='flex items-center justify-center mt-2 text-[#f7740a] font-semibold'>{data == "" ? <span className='flex items-center gap-2'><LoaderCircle className='animate-spin' />  {t('scan.loading')}</span> : <span className='text-center'>{data}</span>}</p>
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
                                                                isWithinRadius ? <div className='flex items-center flex-col justify-center gap-4'>
                                                                    <ConfettiExplosion zIndex={99} />
                                                                    <img src={LC.src} alt="Location Correct Icon" className='w-32 translate-x-3' />
                                                                    <div className='font-semibold'>
                                                                        <p className='flex items-center gap-2'><MapPin /> {codeData.name}</p>
                                                                        <p className='flex items-center gap-2 text-[#f7740a] mt-1'><Coins /> {t('scan.pe')} : +{codeData.points}</p>
                                                                    </div>
                                                                </div> :
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
                        </DialogHeader>
                    </DialogContent>
                </Dialog>}
            </div>
        </>
    )
}

export default Qr