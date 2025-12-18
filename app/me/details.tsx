"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import Loader from '../components/loader';
import axios from 'axios';
import { server } from "@/app/config.json";
import { useTranslations } from 'next-intl';
import { motion } from "motion/react";
import { ChevronDown, QrCode, TicketCheck } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import NF from "@/assets/media/card/icon/notfound.svg";

import PA from "@/assets/media/icon/PA.svg";
import PR from "@/assets/media/icon/PR.svg";
import { Button } from '@/components/ui/button';

interface Transaction {
    point: string;
    type: string;
    place: string;
    id: string;
    idRedeem?: boolean;
    redeemAt: {
        seconds: number;
    };
}

const INITIAL_ITEMS_TO_SHOW = 10;
const ITEMS_PER_LOAD = 10;

function Details() {
    const t = useTranslations('Profile');
    const [user, setUser] = useState<User | null>(null);
    const [transcaton, setTranscaton] = useState<Transaction[] | null>(null);
    const [numDisplayedItems, setNumDisplayedItems] = useState<number>(INITIAL_ITEMS_TO_SHOW);
    const [isR, setIsR] = useState(false);
    const [open, setOpen] = useState(false);
    const [detailImage, setDetailImage] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const checkUser = await axios.get(`${server}/transactions/getbyuser`, {
                    headers: {
                        aetheruid: user.uid
                    }
                })
                setTranscaton(checkUser.data.transactions);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!user || !transcaton) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        )
    }

    const itemsToDisplay = transcaton.slice(0, numDisplayedItems);

    const handleLoadMore = () => {
        setNumDisplayedItems(prevCount => Math.min(prevCount + ITEMS_PER_LOAD, transcaton.length));
    };

    async function getTransactionDetails(id: String) {
        setDetailImage('');
        setOpen(true);
        try {
            const res = await axios.post(`${server}/transactions/gen`, {
                id,
                email: user?.email
            }, {
                headers: {
                    aetheruid: user?.uid
                },
                responseType: 'arraybuffer'
            })

            const base64 = btoa(
                new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            setDetailImage(`data:image/png;base64,${base64}`);
        } catch {

        }
    }

    return (
        <>
            <div className='grid grid-cols-1 gap-5 mt-4'>
                {
                    transcaton.length == 0 ? <>
                        <div className='flex items-center flex-col justify-center py-8 gap-4'>
                            <motion.div
                                animate={{
                                    x: [0, -10, 10, -10, 10, -5, 5, 0],
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut"
                                }}
                            >
                                <img src={NF.src} alt="Icon" className='w-28 translate-x-3' />
                            </motion.div>
                            <p className='font-semibold'>{t('notrans')}</p>
                        </div>
                    </> : <>
                        {
                            itemsToDisplay.map((item, index: number) => (
                                <motion.div initial={{ y: 30 }} animate={{ y: 0 }} key={index} className='flex items-center place-content-between'>
                                    <div className='flex items-center gap-3'>
                                        {
                                            item.point.includes("-") ? <>
                                                <img className='w-18' src={PR.src} alt="Icon" />
                                            </> : <>
                                                <img className='w-18' src={PA.src} alt="Icon" />
                                            </>
                                        }
                                        <div>
                                            <p className='font-semibold text-lg'>{t(`transaction.${item.type}`)}</p>
                                            <p className='flex items-center gap-2'>{item.place}
                                                {
                                                    item.point.includes("-") && (
                                                        <>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    {
                                                                        item.idRedeem ? (
                                                                            <TicketCheck onClick={() => { getTransactionDetails(item.id); setIsR(true); }} className='text-primary cursor-pointer' />
                                                                        ) : (
                                                                            <QrCode onClick={() => { getTransactionDetails(item.id); setIsR(false); }} className='text-primary cursor-pointer' />
                                                                        )
                                                                    }
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{t('redeem.tooltip')}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </>
                                                    )
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <p className='font-semibold text-lg'>{item.point}</p>
                                </motion.div>
                            ))
                        }
                    </>
                }
            </div>
            {numDisplayedItems < transcaton.length && (
                <div className="mt-8 flex items-center justify-center">
                    <Button
                        onClick={handleLoadMore}
                    >
                        <ChevronDown />
                        {t('more')}
                    </Button>
                </div>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('redeem.title')}</DialogTitle>
                        {!isR && <p className='mb-4'>{t('redeem.decs')}</p>}
                        {
                            detailImage == '' ?
                                <div className='w-full flex items-center justify-center my-8'><Loader /></div>
                                : <img src={detailImage} alt="Image" className="rounded-2xl mt-3" />
                        }

                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Details