"use client"

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import tgFetch from '@/lib/fetch';
import { server } from "@/app/config.json";
import Loader from '@/app/components/loader';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { LoaderCircleIcon, Plus } from 'lucide-react';
import axios from 'axios';
import { getCookie } from 'cookies-next/client';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface detailsItem {
    point?: string;
    popular?: string;
    pricing?: string
    tel?: string
    website?: string
}

function EditModal({ open, setOpen, id }: { open: boolean, setOpen: (open: boolean) => void, id: string }) {
    const t = useTranslations('Dashboard.item.activities.edit')
    const [details, setDetails] = useState<detailsItem>({});
    const [loading, setLoading] = useState(false);
    const [updateType, setUpdateType] = useState('');
    const [updateValue, setUpdateValue] = useState('');
    const [sendLoading, setSendLoading] = useState(false);

    useEffect(() => {
        if (id) {
            async function getPrevDetails() {
                setLoading(true);
                try {
                    const res = await tgFetch({ url: `${server}/edit/activities/getdetailsfromid?id=${id}` })
                    setDetails(res.data);
                } catch (e: any) {
                    console.log(e.message)
                } finally {
                    setLoading(false);
                }
            }
            getPrevDetails();
        }
    }, [id])

    async function sendUpdate() {
        if (!updateType || !updateValue) return;
        setSendLoading(true);
        try {
            const res = await axios.patch(`${server}/edit/activities/updateDetails`, {
                id,
                key: updateType,
                value: updateValue,
            }, {
                headers: {
                    Authorization: `Bearer ${getCookie('guide_key')}`
                }
            })
            toast.success(t('toast.succ'), {
                description: t('toast.succd')
            });
            setTimeout(() => window.location.reload(), 3000)
        } catch {
            toast.error(t('toast.err'), {
                description: t('toast.errd')
            })
        } finally {
            setSendLoading(false);
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('title')}</DialogTitle>
                    </DialogHeader>
                    <p>{t('d1')} <span className='font-semibold text-primary'>{id}</span> {t('d2')}</p>
                    {
                        loading ?
                            <div className='w-full flex items-center justify-center my-12'>
                                <Loader />
                            </div>
                            :
                            <>
                                {
                                    Object.keys(details).length != 0 && <div className='grid grid-cols-2 gap-3'>
                                        {Object.keys(details).map((index: string, key) => (
                                            <div key={key}>
                                                <h1><span className='capitalize font-semibold'>{t(`cat.${index}`)}</span> : {details[index as keyof detailsItem]}</h1>
                                            </div>
                                        ))}
                                    </div>
                                }
                                <div className='flex items-start justify-start w-full gap-3 mt-2'>
                                    <Select onValueChange={(e) => setUpdateType(e)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('splace')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="points">{t('cat.points')}</SelectItem>
                                            <SelectItem value="popular">{t('cat.popular')}</SelectItem>
                                            <SelectItem value="pricing">{t('cat.pricing')}</SelectItem>
                                            <SelectItem value="tel">{t('cat.tel')}</SelectItem>
                                            <SelectItem value="website">{t('cat.website')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input value={updateValue} onChange={(e) => setUpdateValue(e.target.value)} type='text' placeholder={t('inplace')} />
                                    <Button onClick={sendUpdate}>{sendLoading ? <LoaderCircleIcon className='animate-spin' /> : <Plus />}</Button>
                                </div>
                            </>
                    }

                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditModal