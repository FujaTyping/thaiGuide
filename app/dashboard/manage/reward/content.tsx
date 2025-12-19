"use client";

import React, { useState, useEffect } from 'react'
import axios from 'axios';
import tgFetch from '@/lib/fetch';
import { server } from "@/app/config.json"
import Loader from '@/app/components/loader';
import { Badge } from '@/components/ui/badge';
import { CirclePlus, Coins, LoaderCircleIcon, Pencil, Save, ShoppingBasket, Trash2 } from 'lucide-react';
import DeleteModal from './deleteModal';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getCookie } from 'cookies-next/client';

interface itemType {
    id: string;
    decs: string;
    name: string;
    require: string;
    quantity: string;
    image: string;
    fileid: string;
    by: string;
}

interface deleteMD {
    id: string
    fileid: string
}

function Content() {
    const t = useTranslations('Dashboard.item.reward');
    const [data, setData] = useState<itemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [payload, setPayload] = useState<deleteMD>({
        id: '',
        fileid: ''
    });
    const [open, setOpen] = useState(false);
    const [MCC, setMCC] = useState('');
    const [quantity, setQuantity] = useState('');
    const [idQuan, setIdQuan] = useState('');
    const [quanLoading, setQuanLoading] = useState(false);

    useEffect(() => {
        async function getDatt() {
            const res = await tgFetch({ url: `${server}/edit/redeem/getall` })
            setData(res.data);
            setLoading(false);
        }
        getDatt();
    }, [])

    async function updateQuantity() {
        setQuanLoading(true);
        try {
            const realQuan = parseInt(quantity) < 0 ? 'Unlimited' : quantity
            await axios.patch(`${server}/edit/redeem/quantityChange`, {
                id: idQuan,
                quantity: realQuan
            }, {
                headers: {
                    Authorization: `Bearer ${getCookie('guide_key')}`
                }
            })
            setQuanLoading(false);
            toast.success(t('toast.succ'), {
                description: t('toast.dsucc')
            });
            setTimeout(() => window.location.reload(), 4000);
        } catch {
            toast.error(t('toast.err'), {
                description: t('toast.derr')
            })
            setQuanLoading(false);
        }
    }

    if (loading) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        );
    }

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <Link href={'/dashboard/manage/reward/new'} className='cursor-pointer py-12 bg-primary rounded-xl flex items-center justify-center p-3 px-4 flex-col text-white gap-4'>
                    <CirclePlus size={48} />
                    <div className='text-center'>
                        <h1 className='font-bold text-xl md:text-2xl mb-1'>{t('new')}</h1>
                        <p>{t('newd')}</p>
                    </div>
                </Link>
                {data.map((item, index) => (
                    <div className='relative border-3 border-primary rounded-xl flex flex-col items-center justify-center p-4 space-y-4'>
                        <img src={item.image} alt="Product" className='rounded-xl h-62 object-cover' />
                        <div className='flex items-center justify-center flex-col'>
                            <h1 className='font-semibold text-xl'>{item.name}</h1>
                            <p className='mt-1'>{item.decs.substring(0, 85)}...</p>
                            <p className='mt-1 font-semibold'>{t('by')} : {item.by}</p>
                            <div className='flex items-center gap-2 mt-3'>
                                <Badge><Coins /> {item.require}</Badge>
                                <Badge><ShoppingBasket /> {item.quantity}</Badge>
                            </div>
                        </div>
                        <div className='absolute top-3 right-4 flex items-center gap-2 text-primary'>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Trash2 size={20}
                                        onClick={() => {
                                            setPayload({
                                                id: item.id,
                                                fileid: item.fileid
                                            });
                                            setMCC('');
                                            setOpen(true);
                                        }}
                                        className='cursor-pointer' />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('del')}</p>
                                </TooltipContent>
                            </Tooltip>
                            <Popover>
                                <PopoverTrigger>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Pencil size={20} className='cursor-pointer'
                                                onClick={() => {
                                                    setQuantity(item.quantity == 'Unlimited' ? '-1' : item.quantity);
                                                    setIdQuan(item.id);
                                                    setQuanLoading(false);
                                                }}
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{t('edit')}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className='space-y-3'>
                                        <h2 className='font-semibold'>{t('editquan.title')}</h2>
                                        <Input onChange={(e) => setQuantity(e.target.value)} value={parseInt(quantity)} type='number' />
                                        <p className='text-sm'>{t('editquan.inputno')}</p>
                                        <Button className='cursor-pointer dark:text-white' onClick={updateQuantity}>{quanLoading ? <LoaderCircleIcon className='animate-spin' /> : <Save />}{t('editquan.save')}</Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                ))}
            </div>
            <DeleteModal open={open} setOpen={setOpen} payload={payload} MCC={MCC} setMCC={setMCC} />
        </>
    )
}

export default Content