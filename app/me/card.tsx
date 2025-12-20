/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Atropos from 'atropos/react';
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import { Coins, Flame } from 'lucide-react';
import Loader from '../components/loader';
import axios from 'axios';
import { server } from "@/app/config.json";
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from "motion/react";
import IQR from "@/assets/media/icon/scanner.svg";
import IRM from "@/assets/media/icon/gift.svg";
import ITG from "@/assets/media/icon/target.svg";
import TANDIA from "@/assets/media/maskot/tan/TanUpper.webp";
import SplitText from '@/components/bits/SplitText/SplitText';
import moment from 'moment';
import STAMPS from "@/assets/media/card/icon/stamp.svg"

import './share.css'
import Sharebt from '../components/sharebt';
import { Progress } from '@/components/ui/progress';
import { AudioPlayer, AudioPlayerRef } from 'react-audio-play';

function Card() {
    const t = useTranslations('Profile');
    const [user, setUser] = useState<User | null>(null);
    const [uData, setUData] = useState<any | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [welState, setWelState] = useState(1);
    const [showJoin, setShowJoin] = useState(false);
    const playerBadgeRef = useRef<AudioPlayerRef>(null);

    function showJoinded() {
        setShowJoin(true);
        playerBadgeRef.current?.play();
        setTimeout(() => {
            setShowJoin(false);
        }, 8000);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const checkUser = await axios.post(`${server}/user`, {
                    name: user.displayName || user.email,
                    pfp: user.photoURL || "https://ik.imagekit.io/61sqw5prw/thaiGuide/ano.svg?updatedAt=1761136329818"
                }, {
                    headers: {
                        aetheruid: user.uid
                    }
                })
                setUData(checkUser.data);
                if (checkUser.data.new) {
                    const NEWBGD = new Audio('/audio/maskot/welcomeTan.wav');
                    NEWBGD.volume = 0.8; NEWBGD.play();
                    setWelState(1);
                    setIsOpen(true);
                }
            }
        });

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
        const trimmedUid = uid.slice(0, -4);
        return trimmedUid.replace(/(.{3})/g, '$1-').replace(/-$/, '');
    };

    const displayUid = formatUid(user.uid);

    return (
        <>
            <AudioPlayer ref={playerBadgeRef} src="/audio/JoinSound.mp3" style={{ display: "none" }} volume={60} />
            <Atropos className='mt-8 cursor-pointer' onClick={() => setShareOpen(true)}>
                <div
                    className='relative overflow-hidden rounded-t-2xl'
                >
                    <img src={uData.bg} className='w-full h-[400px] object-cover' alt="Card Background" />
                    <div className='absolute top-0 right-0 p-4 text-white'>
                        <p className='text-2xl font-semibold flex items-center gap-2'><Coins /> {uData.point}</p>
                        <p className='text-2xl font-semibold flex items-center gap-2'><Flame /> {uData.streak || 0}</p>
                    </div>
                    <div className='absolute h-48 bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-primary/70 to-transparent'></div>
                    <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white rounded-4xl'>
                        <div className='mb-6 flex flex-col gap-2'>
                            <img src={`${user.photoURL || uData.pfp}`} alt="Profile" className='w-28 rounded-full' />
                            <div>
                                <h1 className='text-3xl md:text-4xl font-bold mb-2'>{user.displayName || uData.name}</h1>
                                <h2 className='font-semibold'>{t('cip')} : {uData.checkin}</h2>
                            </div>
                        </div>
                        <p className='text-sm'>{displayUid}</p>
                    </div>
                </div>
                <div className='bg-muted w-full rounded-b-4xl relative'>
                    <p className='absolute z-1 top-0 left-4 md:left-8 text-xs font-semibold translate-y-0.5'>{t('lvl')} {uData.lv} : {uData.exp}/{uData.nextexp}</p>
                    <Progress value={parseInt(uData.exp)} max={parseInt(uData.nextexp)} className='rounded-t-2xl h-6' />
                </div>
                <AnimatePresence initial={false}>
                    {
                        showJoin && <motion.div
                            initial={{ opacity: 0, scale: 3 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.6 }}
                            className='absolute bottom-10 right-4 md:bottom-12 md:right-8 font-bold text-white text-xl'>
                            <img src={STAMPS.src} alt="Icon" className='w-19 md:w-26' />
                            <div className='absolute top-5 md:top-7 text-center -rotate-44'>
                                <p className='text-xs -mb-2'>{t('join')}</p>
                                <h1 className='text-sm md:text-xl'>{moment().format('L')}</h1>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </Atropos>
            <Dialog open={isOpen} onOpenChange={(e) => { setIsOpen(e); if (!e) showJoinded(); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('welcome.title')}</DialogTitle>
                        <p>{t('welcome.decs')}</p>
                    </DialogHeader>
                    <div className='flex items-center justify-center flex-col'>
                        <div className='-ml-6 relative w-full flex items-center justify-center'>
                            <img src={TANDIA.src} alt="Tan" className='w-[250px] z-2' />
                            <img src={IQR.src} alt="Icon" className='w-16 rotate-4 opacity-65 absolute -ml-[200px] -mt-35' />
                            <img src={IRM.src} alt="Icon" className='w-16 -rotate-4 opacity-65 absolute -mr-[250px]' />
                            <img src={ITG.src} alt="Icon" className='w-16 -rotate-4 opacity-65 absolute -ml-[200px] -mb-25' />
                        </div>
                        <div className='border-primary border-3 p-2 px-4 rounded-2xl'>
                            <h1 className='text-lg font-semibold mb-1'>{t('welcome.name')} {`(${t('welcome.nickname')})`}</h1>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={welState}
                                    initial={{ x: 10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -10, opacity: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                    className='text-center md:text-left'
                                >
                                    {welState == 1 && (
                                        <SplitText
                                            text={t('welcome.1.decs')}
                                            splitType="words"
                                            from={{ opacity: 0, y: 40 }}
                                            to={{ opacity: 1, y: 0 }}
                                            threshold={0.1}
                                            textAlign="left"
                                        />
                                    )}
                                    {welState == 2 && (
                                        <SplitText
                                            text={t('welcome.2.decs')}
                                            splitType="words"
                                            from={{ opacity: 0, y: 40 }}
                                            to={{ opacity: 1, y: 0 }}
                                            threshold={0.1}
                                            textAlign="left"
                                        />
                                    )}

                                    {welState == 3 && (
                                        <SplitText
                                            text={t('welcome.3.decs')}
                                            splitType="words"
                                            from={{ opacity: 0, y: 40 }}
                                            to={{ opacity: 1, y: 0 }}
                                            threshold={0.1}
                                            textAlign="left"
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                        </div>
                        <Button className='bg-primary hover:bg-primary text-white mt-2 cursor-pointer w-full' onClick={() => { if (welState < 3) { setWelState(welState + 1) } else { setIsOpen(false); showJoinded(); } }}>
                            {welState < 3 ? t('welcome.next') : t('welcome.start')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('share.title')}</DialogTitle>
                        <p className='mb-4'>{t('share.decs')}</p>
                        <Sharebt onlyContent={true} link={`https://www.thaiguide.in.th/traveler/${btoa(user.uid)}`} />
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Card
