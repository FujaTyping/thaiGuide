import React from 'react';
import Link from 'next/link';
import type { Metadata } from "next";
import Didyouknow from "@/app/components/didyouknow";

import OOFF from "@/assets/media/sos/1151.png";
import OSST from "@/assets/media/sos/1672.png";
import { Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ONO from "@/assets/media/sos/191.png";
import OSSN from "@/assets/media/sos/1169.png";
import ONN from "@/assets/media/sos/199.png";
import OSEF from "@/assets/media/sos/1784.png";
import OONF from "@/assets/media/sos/1195.png";
import OTFS from "@/assets/media/sos/1356.png";

const EPhoneBook = [
    {
        name: "tpt",
        telephone: "1155",
        image: OOFF
    },
    {
        name: "taot",
        telephone: "1672",
        image: OSST
    },
    {
        name: "pt",
        telephone: "191",
        image: ONO
    },
    {
        name: "am",
        telephone: "1669",
        image: OSSN
    },
    {
        name: "tsc",
        telephone: "1356",
        image: OTFS
    }
]

const PhoneBook = [
    {
        name: "fd",
        telephone: "199",
        image: ONN
    },
    {
        name: "ddpm",
        telephone: "1784",
        image: OSEF
    },
    {
        name: "csd",
        telephone: "1195",
        image: OONF
    }
]

export const metadata: Metadata = {
    title: "ThaiGuide – Emergency & Safety"
};

function Page() {
    const t = useTranslations('SOS');

    return (
        <>
            <main className='tg-container'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>{t('decs')}</p>
                <div className='my-12 grid grid-cols-1 md:grid-cols-3 gap-12'>
                    {
                        EPhoneBook.map((item, index) => (
                            <div className='flex flex-col items-center justify-center gap-2' key={index}>
                                <img src={item.image.src} alt="Icon" className='w-20' />
                                <p className='font-semibold text-2xl'>{t(`number.${item.name}`)}</p>
                                <Link href={`tel:${item.telephone}`}>
                                    <p className='flex flex-row items-center gap-2 text-xl text-[#f7740a]'><Phone /> <b>{item.telephone}</b></p>
                                </Link>
                            </div>
                        ))
                    }
                </div>
                <div>
                    <h1 className='font-bold text-4xl'>{t('ndtitle')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-12'>
                    {
                        PhoneBook.map((item, index) => (
                            <div className='flex flex-col items-center justify-center gap-2' key={index}>
                                <img src={item.image.src} alt="Icon" className='w-20' />
                                <p className='font-semibold text-2xl text-center'>{t(`number.${item.name}`)}</p>
                                <Link href={`tel:${item.telephone}`}>
                                    <p className='flex flex-row items-center gap-2 text-xl text-[#f7740a]'><Phone /> <b>{item.telephone}</b></p>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </main>
            <Didyouknow />
        </>
    )
}

export default Page