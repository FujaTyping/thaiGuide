"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FileScan } from 'lucide-react';
import axios from 'axios';
import { server } from "@/app/config.json";
import Loader from '@/app/components/loader';
import { motion } from 'motion/react';
import NF from "@/assets/media/card/icon/notfound.svg";
import CHK from "@/assets/media/icon/dashcheck.svg";
import { useTranslations } from 'next-intl';

function DeleteModal({ open, setOpen, id }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, id: string }) {
    const t = useTranslations('Dashboard.item.qrcode');
    const [delStatus, setDelStatus] = useState('');

    useEffect(() => {
        setTimeout(() => {
            setDelStatus('');
        }, 500)
    }, [open])

    async function deleteNow() {
        setDelStatus('loading');
        try {
            await axios.delete(`https://${server}/edit/code/remove`, {
                data: {
                    id: id
                }
            })
            setDelStatus('done');
            setTimeout(() => window.location.reload(), 4000)
        } catch {
            setDelStatus('error');
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('deleteTitle')}</DialogTitle>
                    </DialogHeader>
                    {
                        delStatus == 'loading' ? <>
                            <div className='w-full flex items-center justify-center my-8'>
                                <Loader />
                            </div>
                        </> : <>
                            {
                                delStatus == 'error' ? <>
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
                                </> : <>
                                    {
                                        delStatus == 'done' ? <>
                                            <div className='flex items-center flex-col justify-center gap-4'>
                                                <img src={CHK.src} alt="Icon" className='w-30 translate-x-3' />
                                                <div className='flex items-center justify-center flex-col'>
                                                    <p className='font-semibold'>{t('done')}</p>
                                                </div>
                                            </div>
                                        </> : <>
                                            <div>
                                                <p>{t('d1')} <span className='font-semibold text-primary'>{t('d2')}</span></p>
                                                <p className='flex items-center gap-1 mt-2'><span className='font-semibold text-primary flex items-center gap-2'><FileScan size={20} /> {t('qrid')} :</span> {id}</p>
                                            </div>
                                            <DialogFooter className='mt-2'>
                                                <button onClick={deleteNow} className='bg-primary text-white p-2 px-5 rounded-xl cursor-pointer'>
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