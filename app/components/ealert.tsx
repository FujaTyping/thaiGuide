"use client";

import { TriangleAlert } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Marquee from "react-fast-marquee";
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { server } from "@/app/config.json"

interface CData {
    type: string;
    message: string;
    reference?: string;
}

function Ealert() {
    const t = useTranslations('Crisis');
    const [Data, setData] = useState<CData>({
        type: "",
        message: ""
    })

    useEffect(() => {
        async function fetchdata() {
            try {
                const res = await axios.get(`${server}/aleart`)
                setData(res.data)
            } catch {
                setData({
                    type: "Error",
                    message: "Could not fetch the latest alerts. Please try again later"
                })
            }
        }
        fetchdata();
    }, [])

    return (
        <>
            {Data.type &&
                <>
                    <main className='bg-primary text-white border-b-1'>
                        {
                            Data.reference ? <Link href={Data.reference}>
                                <section className='max-w-7xl mx-auto  -mt-1 pb-1.5 px-4 items-center gap-8 relative'>
                                    <div className='flex items-center gap-2 col-span-2 bg-primary w-fit absolute z-2 pr-4'>
                                        <TriangleAlert />
                                        <h1 className='font-bold'>{t('alert')}</h1>
                                    </div>
                                    <Marquee className='z-0'>
                                        <p className='mr-40'>{Data.message}</p>
                                    </Marquee>
                                </section>
                            </Link> : <section className='max-w-7xl mx-auto -mt-1 pb-1.5 px-4 items-center gap-8 relative'>
                                <div className='flex items-center gap-2 col-span-2 bg-primary w-fit absolute z-2 pr-4'>
                                    <TriangleAlert />
                                    <h1 className='font-bold'>{t('alert')}</h1>
                                </div>
                                <Marquee className='z-0'>
                                    <p className='mr-40'>{Data.message}</p>
                                </Marquee>
                            </section>
                        }
                    </main>
                </>
            }
        </>
    )
}

export default Ealert