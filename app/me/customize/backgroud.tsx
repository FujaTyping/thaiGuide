"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { onAuthStateChanged, User } from 'firebase/auth';
import auth from "@/lib/firebaseAuth";
import axios from 'axios';
import { server } from "@/app/config.json";
import Loader from '@/app/components/loader';
import { motion } from "motion/react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import NF from "@/assets/media/card/icon/notfound.svg";
import Customization from "@/assets/media/icon/Customization.svg";
import { Coins } from 'lucide-react';

interface BannerR {
    bg: string;
    title: string;
    redeemOnly: boolean;
}

function CustomizeBG() {
    const t = useTranslations('Customize');
    const [user, setUser] = useState<User | null>(null);
    const [bannerRES, setBannerRES] = useState<BannerR[] | null>(null);
    const [open, setOpen] = useState(false);
    const [wantCbg, setWantCBg] = useState<BannerR | null>(null);
    const [statuss, setStatuss] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                try {
                    const banRES = await axios.put(`https://${server}/customize/banner`, { uid: user.uid })
                    setBannerRES(banRES.data.banners);
                } catch {
                    setBannerRES([]);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    async function updateBG() {
        setStatuss('loading');
        if (user) {
            try {
                await axios.patch(`https://${server}/user/customize/banner`, {
                    uid: user.uid,
                    url: wantCbg?.bg
                })
                setStatuss('done');

                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } catch {
                setStatuss('err');
            }
        }
    }

    if (!user || !bannerRES) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        )
    }

    return (
        <>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4'>
                {
                    bannerRES.map((item, index) => (
                        <motion.div
                            whileHover={{ scale: 1.04, rotate: -2 }}
                            whileTap={{ scale: 0.9 }}
                            key={index}
                            onClick={() => { setWantCBg(item); setStatuss(''); setOpen(true) }}
                        >
                            <div>
                                <div
                                    className='relative overflow-hidden rounded-xl cursor-pointer'
                                >
                                    <img src={item.bg} alt="Banner" className='h-36 md:h-32 w-full object-cover' />
                                    <div className='absolute bottom-0 left-0 right-0 p-4 text-white rounded-4xl z-12'>
                                        <div className='flex flex-col gap-2'>
                                            <h1 className='text-xl font-bold mb-2'>{item.title}</h1>
                                        </div>
                                    </div>
                                    {item.redeemOnly && <div className='top-2 right-2 absolute p-2 text-white rounded-full bg-[#f7740a]'><Coins size={18} /></div>}
                                    <div className='absolute h-14 md:h-12 bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-[#f7740a]/70 to-transparent'></div>
                                </div>
                            </div>
                        </motion.div>
                    )
                    )
                }
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('confirm.title')}</DialogTitle>
                    </DialogHeader>
                    {
                        statuss == 'loading' ? <>
                            <div className='w-full flex items-center justify-center my-8'>
                                <Loader />
                            </div>
                        </> : statuss == 'done' ? <>
                            <div className='flex items-center flex-col justify-center gap-4 mt-2'>
                                <img src={Customization.src} alt="Success" className='w-32' />
                                <p className='font-semibold'>{t('confirm.done')}</p>
                            </div>
                        </> :
                            statuss == 'err' ? <>
                                <div className='flex items-center flex-col justify-center gap-4 mt-1'>
                                    <motion.div
                                        animate={{
                                            x: [0, -10, 10, -10, 10, -5, 5, 0],
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <img src={NF.src} alt="Not Found" className='w-32' />
                                    </motion.div>
                                    <p className='font-semibold'>{t('confirm.err')}</p>
                                </div>
                            </> : <>
                                <p className='mb-4'>{t('confirm.to')} <span className='font-bold text-[#f7740a]'>{wantCbg?.title}</span></p>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <button className='p-2 px-5 rounded-xl border-2 cursor-pointer'>
                                            {t('confirm.canBTN')}
                                        </button>
                                    </DialogClose>
                                    <button onClick={updateBG} className='bg-[#f7740a] text-white p-2 px-5 rounded-xl cursor-pointer'>
                                        {t('confirm.conBTN')}
                                    </button>
                                </DialogFooter>
                            </>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CustomizeBG