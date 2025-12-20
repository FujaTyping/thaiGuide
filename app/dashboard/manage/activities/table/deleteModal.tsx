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
import { Tent } from 'lucide-react';
import axios from 'axios';
import { server } from "@/app/config.json";
import Loader from '@/app/components/loader';
import { motion } from 'motion/react';
import NF from "@/assets/media/card/icon/notfound.svg";
import CHK from "@/assets/media/icon/dashcheck.svg";
import { useTranslations } from 'next-intl';
import { getCookie } from 'cookies-next/client';
import { Button } from '@/components/ui/button';

function DeleteModal({ open, setOpen, id, fileid }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, id: string, fileid: string }) {
    const t = useTranslations('Dashboard.item.activities');
    const [delStatus, setDelStatus] = useState('');

    useEffect(() => {
        setTimeout(() => {
            setDelStatus('');
        }, 500)
    }, [open])

    async function deleteNow() {
        setDelStatus('loading');
        try {
            await axios.delete(`${server}/edit/activities/remove`, {
                data: {
                    id: id,
                    fid: fileid
                },
                headers: {
                    Authorization: `Bearer ${getCookie('guide_key')}`
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
                        <DialogTitle className='text-2xl'>{t('delete.title')}</DialogTitle>
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
                                        <p className='font-semibold'>{t('delete.err')}</p>
                                    </div>
                                </> : <>
                                    {
                                        delStatus == 'done' ? <>
                                            <div className='flex items-center flex-col justify-center gap-4'>
                                                <img src={CHK.src} alt="Icon" className='w-30 translate-x-3' />
                                                <div className='flex items-center justify-center flex-col'>
                                                    <p className='font-semibold'>{t('delete.done')}</p>
                                                </div>
                                            </div>
                                        </> : <>
                                            <div>
                                                <p>{t('delete.d0')} <span className='font-semibold text-primary'>{t('delete.d1')}</span></p>
                                                <p className='flex items-center gap-1 mt-2'><span className='font-semibold text-primary flex items-center gap-2'><Tent size={20} /> {t('delete.actid')} :</span> {id}</p>
                                            </div>
                                            <DialogFooter className='mt-2'>
                                                <Button onClick={deleteNow}>
                                                    {t('delete.conBTN')}
                                                </Button>
                                                <DialogClose asChild>
                                                    <Button variant={'outline'}>
                                                        {t('delete.canBTN')}
                                                    </Button>
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