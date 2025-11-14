"use client";

import React, { useState } from 'react';
import { Search, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import KAWPT from "@/assets/media/maskot/photo/BackKawaii.webp";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
//import { server } from "@/app/config.json";
//import axios from "axios";
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
//import Loader from '../components/loader';

import SICO from "@/assets/media/icon/magnifier.webp";

function SSearch() {
    const [searchType, setSearchType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAlert, setsShowAlert] = useState(false);
    const t = useTranslations('Search');

    function searchItems() {
    }

    return (
        <>
            <div className='flex items-center gap-4'>
                <Input disabled onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder={t('placeholders')} className='h-10 mt-3 cursor-not-allowed' />
                <Button disabled className='cursor-not-allowed w-10 h-10 translate-y-1' onClick={() => searchItems()}><Search /></Button>
            </div>
            {
                showAlert && <>
                    <motion.div
                        animate={{
                            x: [0, -10, 10, -10, 10, -5, 5, 0],
                        }}
                        transition={{
                            duration: 0.5,
                            ease: "easeInOut"
                        }}
                    >
                        <p className='mt-3 flex items-center gap-2 font-semibold text-primary'>
                            <TriangleAlert />
                            <span>{t('require')}</span>
                        </p>
                    </motion.div>
                </>
            }
            <div className='mt-4'>
                <RadioGroup onValueChange={(e) => setSearchType(e)} className='flex items-center gap-4' defaultValue="all">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all" className='cursor-pointer'>{t('type.all')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="activities" id="activities" />
                        <Label htmlFor="activities" className='cursor-pointer'>{t('type.act')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="restaurant" id="restaurant" />
                        <Label htmlFor="restaurant" className='cursor-pointer'>{t('type.res')}</Label>
                    </div>
                </RadioGroup>
            </div>
            <div className='mt-3'>
                <div className='flex items-center justify-center flex-col gap-3 py-12 md:py-8'>
                    <img src={SICO.src} alt="Photo" className='w-24 md:w-26 mb-2' />
                    <div className='text-center space-y-1'>
                        <h1 className='font-semibold text-xl md:text-2xl'>{t('mtt')}</h1>
                        <p>{t('mtd')}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SSearch