/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import auth from "@/lib/firebaseAuth";
import { server } from "@/app/config.json";
import Loader from '@/app/components/loader';
import { /*Pencil,*/ Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from 'motion/react';
import NF from "@/assets/media/card/icon/notfound.svg";
import DELACC from "@/assets/media/icon/delete-acc.svg";
import { deleteCookie } from 'cookies-next/client';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

function Setting() {
    const t = useTranslations('Account');
    const [user, setUser] = useState<User | null>(null);
    const [uData, setUData] = useState<any | null>(null);
    const [reqState, setReqState] = useState("");
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const checkUser = await axios.post(`https://${server}/user`, {
                    userid: user.uid,
                    name: user.displayName,
                    pfp: user.photoURL
                })
                setUData(checkUser.data);
            }
        });

        return () => unsubscribe();
    }, [])

    async function deleteMyAccountNow() {
        setReqState("loading");
        try {
            await axios.delete(`https://${server}/user/delete`, {
                data: {
                    uid: user?.uid
                }
            })
            setReqState("success");
            setTimeout(async () => {
                await signOut(auth);
                setUser(null);
                deleteCookie('traveler_session');
                router.push('/');
            }, 3000);
        } catch {
            setReqState("error");
        }
    }

    if (!user || !uData) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        )
    }

    return (
        <>
            <div className='max-w-7xl mx-auto px-4 py-7'>
                <div className='flex flex-col md:flex-row gap-4 md:gap-0 items-center place-content-between border-[#f7740a] rounded-2xl p-6 md:p-3 px-5 md:px-4 border-3'>
                    <img src={uData.pfp} alt="Avatar" className='w-28 rounded-full' />
                    <div className='flex flex-col items-end gap-1'>
                        <h1 className='text-2xl font-bold flex items-center gap-2'>{uData.name} {/*<Pencil className='text-[#f7740a] font-bold' />*/}</h1>
                        <p>{user.email}</p>
                    </div>
                </div>
                <div className='pt-5'>
                    <div className='flex items-center place-content-between'>
                        <h2 className='flex items-center gap-2 font-semibold'><Trash2 className='text-[#f7740a] font-bold' /> {t('option.delete.btnla')}</h2>
                        <Dialog>
                            <DialogTrigger onClick={() => setReqState("")} className='bg-[#f7740a] text-white p-2 rounded-xl px-5 mt-2 w-fit cursor-pointer'>
                                {t('option.delete.btn')}
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className='text-2xl'>{t('option.delete.confirmTitle')}</DialogTitle>
                                </DialogHeader>
                                {
                                    reqState == "loading" ? <>
                                        <div className='w-full flex items-center justify-center my-8'>
                                            <Loader />
                                        </div>
                                    </> : <>
                                        {
                                            reqState == "error" ? <>
                                                <div className='flex items-center flex-col justify-center gap-4 mt-2'>
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
                                                    <p className='font-semibold'>{t('option.delete.err')}</p>
                                                </div>
                                            </> : <>
                                                {
                                                    reqState == "success" ? <>
                                                        <div className='flex items-center flex-col justify-center gap-4'>
                                                            <img src={DELACC.src} alt="Icon" className='w-30 translate-x-3' />
                                                            <div className='flex items-center justify-center flex-col'>
                                                                <p className='font-semibold'>{t('option.delete.succ')}</p>
                                                            </div>
                                                        </div>
                                                    </> : <>
                                                        <div>
                                                            <p>{t('option.delete.d1')}
                                                                <span className='text-[#f7740a] font-semibold mx-2'>{t('option.delete.d2')}</span>{t('option.delete.d3')}<span className='text-[#f7740a] font-semibold mx-2'>{t('option.delete.d4')}</span>
                                                            </p>
                                                        </div>
                                                        <DialogFooter className='mt-2'>
                                                            <DialogClose asChild>
                                                                <button className='p-2 px-5 rounded-xl border-2 cursor-pointer'>
                                                                    {t('option.delete.canBTN')}
                                                                </button>
                                                            </DialogClose>
                                                            <button onClick={deleteMyAccountNow} className='bg-[#f7740a] text-white p-2 px-5 rounded-xl cursor-pointer'>
                                                                {t('option.delete.conBTN')}
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default Setting