"use client";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Award } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import { server } from "@/app/config.json";
import CHK from "@/assets/media/icon/dashcheck.svg";
import Loader from '@/app/components/loader';
import { motion } from 'motion/react';
import NF from "@/assets/media/card/icon/notfound.svg";
import { useTranslations } from 'next-intl';
import { getCookie } from 'cookies-next/client';

interface deleteMD {
    id: string
    fileid: string
}

function DeleteModal({ open, setOpen, payload, MCC, setMCC }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, payload: deleteMD, MCC: string, setMCC: React.Dispatch<React.SetStateAction<string>> }) {
    const t = useTranslations('Dashboard.item.badge.modal');
    const [loading, setLoading] = useState(false);

    async function deleteBadge() {
        setLoading(true);
        setMCC('');
        try {
            await axios.delete(`${server}/edit/badge/delete`, {
                data: {
                    id: payload.id,
                    fid: payload.fileid
                },
                headers: {
                    Authorization: `Bearer ${getCookie('guide_key')}`
                }
            })
            setMCC('SUCC');
            setLoading(false);
            setTimeout(() => window.location.reload(), 4000)
        } catch {
            setMCC('CSR');
            setLoading(false);
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('title')}</DialogTitle>
                    </DialogHeader>
                    {
                        loading ? <>
                            <div className='w-full flex items-center justify-center my-8'>
                                <Loader />
                            </div>
                        </> : <>
                            {
                                MCC == '' && <>
                                    <div>
                                        <p>{t('d1')} <span className='text-primary font-semibold'>{t('d2')}</span></p>
                                        <div className='flex items-center gap-2 mt-3'><h1 className='flex items-center text-primary font-semibold'><Award /> {t('name')} : </h1>{payload.id.charAt(0).toUpperCase() + payload.id.slice(1)}</div>
                                    </div>
                                    <DialogFooter className='mt-2'>
                                        <button onClick={deleteBadge} className='bg-primary text-white p-2 px-5 rounded-xl cursor-pointer'>
                                            {t('conBTN')}
                                        </button>
                                        <DialogClose asChild>
                                            <button className='p-2 px-5 rounded-xl border-2 cursor-pointer'>
                                                {t('canBTN')}
                                            </button>
                                        </DialogClose>
                                    </DialogFooter>
                                </>
                            }
                            {
                                MCC == 'SUCC' && <>
                                    <div className='flex items-center flex-col justify-center gap-4'>
                                        <img src={CHK.src} alt="Icon" className='w-30 translate-x-3' />
                                        <div className='flex items-center justify-center flex-col'>
                                            <p className='font-semibold'>{t('succ')}</p>
                                        </div>
                                    </div>
                                </>
                            }
                            {
                                MCC == 'CSR' && <>
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
                                        <p className='font-semibold'>{t('err')}</p>
                                    </div>
                                </>
                            }
                        </>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default DeleteModal