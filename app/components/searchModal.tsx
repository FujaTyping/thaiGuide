"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Search, TentTree, Utensils } from 'lucide-react';
import SICO from "@/assets/media/icon/magnifier.webp";
import { useTranslations } from 'next-intl';
import Loader from './loader';
import { server } from '@/app/config.json';
import axios from 'axios';
import Link from 'next/link';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

function SearchModal({ open, setOpen }: { open: boolean, setOpen: (value: boolean) => void }) {
    const t = useTranslations('Search');
    const [loading, setLoading] = useState(false);
    const [Texts, setTexts] = useState('');
    const [searchContent, setSeachContent] = useState([]);
    const [searchType, setSearchType] = useState('activities');
    const [prevType, setPrevType] = useState('');

    async function searchQuery() {
        if (Texts) {
            setLoading(true);
            try {
                const res = await axios.post(`${server}/search`, {
                    query: Texts,
                    type: searchType
                });
                setSeachContent(res.data);
                setPrevType(searchType);
                setLoading(false);
            } catch {
                setSeachContent([]);
                setLoading(false);
            }
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('title')}</DialogTitle>
                    </DialogHeader>
                    <div>
                        <div>
                            <div className='flex items-center gap-3'>
                                <Input onChange={(e) => setTexts(e.target.value)} type="text" placeholder={t('placeholders')} />
                                <Button onClick={searchQuery} className='cursor-pointer'><Search /></Button>
                            </div>
                            <RadioGroup value={searchType} onValueChange={(e) => setSearchType(e)} className='flex items-center gap-3 mt-3'>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="activities" id="activities" />
                                    <Label htmlFor="activities">{t('type.act')}</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="restaurant" id="restaurant" />
                                    <Label htmlFor="restaurant">{t('type.res')}</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {
                            loading ? <div className='mt-3'>
                                <div className='flex items-center justify-center flex-col gap-6 py-12 md:py-8'>
                                    <Loader />
                                </div>
                            </div> :
                                <>
                                    {
                                        searchContent.length > 0 ? <>

                                            <div className='mt-3 border-0'>
                                                <ScrollArea className="max-h-[300px] w-full border-0 overflow-auto">
                                                    {
                                                        searchContent.map((item: any, index) => (
                                                            <Link onClick={() => setOpen(false)} key={index} href={`/${prevType == 'activities' ? 'activity' : prevType}/${item.id}`} className={`flex flex-col gap-1 py-4 border-b-primary ${index < searchContent.length - 1 && 'border-b-1'}`}>
                                                                <Badge variant="default" className='capitalize'>{prevType == 'activities' ? <TentTree /> : <Utensils />} {prevType}</Badge>
                                                                <p>{item.title || item.name}</p>
                                                            </Link>
                                                        ))
                                                    }
                                                </ScrollArea>
                                            </div>
                                        </> : <div className='mt-3'>
                                            <div className='flex items-center justify-center flex-col gap-3 py-12 md:py-8'>
                                                <img src={SICO.src} alt="Photo" className='w-22 mb-2' />
                                                <div className='text-center space-y-1'>
                                                    <h1 className='font-semibold text-xl'>{t('mtt')}</h1>
                                                    <p className='text-sm md:text-base'>{t('mtd')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </>
                        }
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default SearchModal