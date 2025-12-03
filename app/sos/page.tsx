import React from 'react';
import Link from 'next/link';
import type { Metadata } from "next";

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
import TGtitle from '../components/tgtitle';
import { embassy } from './data.json';
import Flag from 'react-world-flags';

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
    },
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
                <TGtitle title={t('title')} decs={t('decs')} />
                <div className='my-12 grid grid-cols-1 md:grid-cols-3 gap-12'>
                    {
                        EPhoneBook.map((item, index) => (
                            <div className='text-center flex flex-col items-center justify-center gap-2' key={index}>
                                <img src={item.image.src} alt="Icon" className='w-20' />
                                <p className='font-semibold text-2xl'>{t(`number.${item.name}`)}</p>
                                <Link href={`tel:${item.telephone}`}>
                                    <p className='flex flex-row items-center gap-2 text-xl text-primary dark:text-white'><Phone /> <b>{item.telephone}</b></p>
                                </Link>
                            </div>
                        ))
                    }
                </div>
                <TGtitle title={t('emtitle')} decs={t('emdecs')} second={true} />
                <div className='flex flex-col gap-4 mt-4'>
                    {
                        embassy.map((item, index) => (
                            <div key={index} className={`flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 place-content-between ${index + 1 != embassy.length && 'border-b'} pb-3 py-2`}>
                                <div className='space-y-1 md:space-y-2'>
                                    <div className='flex items-center gap-3'>
                                        <Flag className='w-5 h-5  object-cover rounded-full' code={item.country_code} />
                                        <h2 className='font-semibold'>{item.name}</h2>
                                    </div>
                                    <p className='text-sm md:text-base'>{item.location}</p>
                                </div>
                                <Link href={`tel:${item.tel}`} className='flex flex-row items-center gap-2 font-semibold text-primary dark:text-white'>
                                    <Phone className='w-5 md:w-6' />
                                    <h2>{item.tel}</h2>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </main>

        </>
    )
}

export default Page