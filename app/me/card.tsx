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
import { ShareSocial } from 'react-share-social';

const style = {
    root: {
        borderRadius: 3,
        border: 0,
        padding: 0,
        color: 'white',
    },
    copyContainer: {
        background: '#f7740a',
        border: 0
    }
};

import './share.css'

function Card() {
    const t = useTranslations('Profile');
    const [user, setUser] = useState<User | null>(null);
    const [uData, setUData] = useState<any | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [welState, setWelState] = useState(1);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const checkUser = await axios.post(`https://${server}/user`, {
                    userid: user.uid,
                    name: user.displayName || user.email,
                    pfp: user.photoURL || "https://ik.imagekit.io/61sqw5prw/thaiGuide/ano.svg?updatedAt=1761136329818"
                })
                setUData(checkUser.data);
                if (checkUser.data.new) {
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
            <Atropos className='mt-8 cursor-pointer' onClick={() => setShareOpen(true)}>
                <div
                    className='relative overflow-hidden rounded-4xl'
                >
                    <img src={uData.bg} className='w-full h-[400px] object-cover' alt="Card Background" />
                    <div className='absolute top-0 right-0 p-4 text-white'>
                        <p className='text-2xl font-semibold flex items-center gap-2'><Coins /> {uData.point}</p>
                        <p className='text-2xl font-semibold flex items-center gap-2'><Flame /> {uData.streak || 0}</p>
                    </div>
                    <div className='absolute h-48 bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#f7740a]/70 to-transparent'></div>
                    <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white rounded-4xl'>
                        <div className='mb-6 flex flex-col gap-2'>
                            <img src={`${user.photoURL || uData.pfp}`} alt="Profile" className='w-28 rounded-full' />
                            <div>
                                <h1 className='text-3xl md:text-4xl font-bold mb-2'>{user.displayName || user.email}</h1>
                                <h2 className='font-semibold'>{t('cip')} : {uData.checkin}</h2>
                            </div>
                        </div>
                        <p className='text-sm'>{displayUid}</p>
                    </div>
                </div>
            </Atropos>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('welcome.title')}</DialogTitle>
                        <p>{t('welcome.decs')}</p>
                    </DialogHeader>
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
                                <>
                                    <div className='flex items-center justify-center py-3 md:py-2 mb-5'>
                                        <img src={ITG.src} alt="Icon" className='w-32' />
                                    </div>
                                    <h2 className='text-xl font-semibold'>{t('welcome.1.title')}</h2>
                                    <p>{t('welcome.1.decs')}</p>
                                </>
                            )}
                            {welState == 2 && (
                                <>
                                    <div className='flex items-center justify-center py-3 md:py-2 mb-5'>
                                        <img src={IQR.src} alt="Icon" className='w-32' />
                                    </div>
                                    <h2 className='text-xl font-semibold'>{t('welcome.2.title')}</h2>
                                    <p>{t('welcome.2.decs')}</p>
                                </>
                            )}

                            {welState == 3 && (
                                <>
                                    <div className='flex items-center justify-center py-3 md:py-2 mb-5'>
                                        <img src={IRM.src} alt="Icon" className='w-32' />
                                    </div>
                                    <h2 className='text-xl font-semibold'>{t('welcome.3.title')}</h2>
                                    <p>{t('welcome.3.decs')}</p>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    <Button className='bg-[#f7740a] hover:bg-[#f7740a] text-white mt-2 cursor-pointer' onClick={() => { if (welState < 3) { setWelState(welState + 1) } else { setIsOpen(false) } }}>
                        {welState < 3 ? t('welcome.next') : t('welcome.start')}
                    </Button>
                </DialogContent>
            </Dialog>
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('share.title')}</DialogTitle>
                        <p className='mb-4'>{t('share.decs')}</p>
                        <div className='flex items-center justify-center'>
                            <ShareSocial
                                url={`https://www.thaiguide.in.th/traveler/${btoa(user.uid)}`}
                                style={style}
                                socialTypes={['facebook', 'twitter', 'reddit', 'line', 'telegram']}
                            />
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Card