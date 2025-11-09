"use client"

import React, { useState, useEffect } from 'react'
import BarcodeScanner from 'react-qr-barcode-scanner';
import NL from "@/assets/media/card/icon/notfound.svg";
import { motion } from 'motion/react';
import { LoaderCircle, RotateCcw } from 'lucide-react';
import Loader from '@/app/components/loader';
import axios from 'axios';
import { server } from "@/app/config.json";
import CHK from "@/assets/media/icon/dashcheck.svg";
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

function Scanner() {
    const t = useTranslations('Dashboard.item.redeem');
    const [isMobile, setIsMobile] = useState(false);
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    async function checkCode(raw: string) {
        setLoading(true);
        try {
            await axios.post(`${server}/reward/redeem`, { raw })
            setData('SUCC');
            setLoading(false);
        } catch {
            setData('ERR');
            setLoading(false);
        }
    }

    if (isMobile) return (
        <div className='mt-4 flex items-center justify-center flex-col md:hidden gap-2'>
            {
                data == '' ? <>
                    <BarcodeScanner
                        width={600}
                        height={450}
                        onUpdate={(err, result: any) => {
                            if (result) {
                                setData(result.text);
                                checkCode(result.text);
                            }
                        }}
                    />
                    <p className='flex items-center justify-center mt-2 text-primary font-semibold'><span className='flex items-center gap-3'><LoaderCircle className='animate-spin' /> {t('wait')}</span></p>
                </> : <>
                    {
                        loading && <div className='my-5'><Loader /></div>
                    }
                    {
                        data == 'SUCC' && <>
                            <div className='mt-3 flex items-center justify-center flex-col gap-4'>
                                <img src={CHK.src} alt="Icon" className='w-30 translate-x-1' />
                                <div className='text-center'>
                                    <h2 className='font-bold text-primary'>{t('succ.h2')}</h2>
                                    <p className='text-sm mt-1'>{t('succ.decs')}</p>
                                </div>
                                <Button className='w-full mt-2 cursor-pointer' onClick={() => setData('')}><RotateCcw />{'again'}</Button>
                            </div>
                        </>
                    }
                    {
                        data == 'ERR' && <>
                            <div className='mt-3 flex items-center justify-center flex-col gap-4'>
                                <motion.div
                                    animate={{
                                        x: [0, -10, 10, -10, 10, -5, 5, 0],
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <img src={NL.src} alt="Icon" className='w-32 translate-x-3' />
                                </motion.div>
                                <div className='text-center'>
                                    <h2 className='font-bold text-primary'>{t('err.h2')}</h2>
                                    <p className='text-sm mt-1'>{t('err.decs')}</p>
                                    <Button className='w-full mt-6 cursor-pointer' onClick={() => setData('')}><RotateCcw />{t('again')}</Button>
                                </div>
                            </div>
                        </>
                    }
                </>
            }
        </div>
    )

    return (
        <>
            <div className='hidden mt-10 md:flex items-center flex-col justify-center gap-4'>
                <motion.div
                    animate={{
                        x: [0, -10, 10, -10, 10, -5, 5, 0],
                    }}
                    transition={{
                        duration: 0.5,
                        ease: "easeInOut"
                    }}
                >
                    <img src={NL.src} alt="Icon" className='w-32 translate-x-3' />
                </motion.div>
                <p className='font-semibold'>{t('onlymobile')}</p>
            </div>
        </>
    )
}

export default Scanner