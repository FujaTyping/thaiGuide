"use client";

import React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { motion } from 'motion/react';
import NF from "@/assets/media/card/icon/notfound.svg";
import DELACC from "@/assets/media/icon/delete-acc.svg";
import Loader from '@/app/components/loader';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { deleteCookie } from 'cookies-next/client';
import { server } from "@/app/config.json";
import { useRouter } from 'next/navigation';
import { signOut, User } from 'firebase/auth';
import auth from "@/lib/firebaseAuth";

function DeleteUserModal({ reqState, setReqState, user, open, setOpen }: { reqState: string, setReqState: (state: string) => void, user: User, open: boolean, setOpen: (state: boolean) => void }) {
    const t = useTranslations('Account');
    const router = useRouter();

    async function deleteMyAccountNow() {
        setReqState("loading");
        try {
            await axios.delete(`${server}/user/delete`, {
                headers: {
                    aetheruid: user?.uid
                }
            })
            setReqState("success");
            setTimeout(async () => {
                await signOut(auth);
                deleteCookie('traveler_session');
                router.push('/');
            }, 3000);
        } catch {
            setReqState("error");
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
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
                                                    <span className='text-primary font-semibold mx-2'>{t('option.delete.d2')}</span>{t('option.delete.d3')}<span className='text-primary font-semibold mx-2'>{t('option.delete.d4')}</span>
                                                </p>
                                            </div>
                                            <DialogFooter className='mt-2'>
                                                <button onClick={deleteMyAccountNow} className='bg-primary text-white p-2 px-5 rounded-xl cursor-pointer'>
                                                    {t('option.delete.conBTN')}
                                                </button>
                                                <DialogClose asChild>
                                                    <button className='p-2 px-5 rounded-xl border-2 cursor-pointer'>
                                                        {t('option.delete.canBTN')}
                                                    </button>
                                                </DialogClose>
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

export default DeleteUserModal