import React from 'react';
import Link from 'next/link';
import type { Metadata } from "next";

import OOFF from "@/assets/media/sos/1151.png";
import OSST from "@/assets/media/sos/1672.png";
import { Phone } from 'lucide-react';
import ONO from "@/assets/media/sos/191.png";
import OSSN from "@/assets/media/sos/1169.png";
import ONN from "@/assets/media/sos/199.png";
import OSEF from "@/assets/media/sos/1784.png";
import OONF from "@/assets/media/sos/1195.png";
import OTFS from "@/assets/media/sos/1356.png";

const EPhoneBook = [
    {
        name: "Tourist Police Thailand",
        telephone: "1155",
        image: OOFF
    },
    {
        name: "Tourism Authority of Thailand",
        telephone: "1672",
        image: OSST
    },
    {
        name: "Police Thailand",
        telephone: "191",
        image: ONO
    },
    {
        name: "Ambulance",
        telephone: "1669",
        image: OSSN
    },
    {
        name: "Transport Safety Center",
        telephone: "1356",
        image: OTFS
    }
]

const PhoneBook = [
    {
        name: "Fire Department",
        telephone: "199",
        image: ONN
    },
    {
        name: "Department of Disaster Prevention and Mitigation",
        telephone: "1784",
        image: OSEF
    },
    {
        name: "Crime Suppression Division",
        telephone: "1195",
        image: OONF
    }
]

export const metadata: Metadata = {
    title: "ThaiGuide – Emergency & Safety"
};

function page() {
    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>Emergency Contacts & Safety</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>Your safety in Thailand is important. This page provides a list of crucial emergency phone numbers. Keep these contacts readily available for any urgent situations you might encounter.</p>
                <div className='my-12 grid grid-cols-1 md:grid-cols-3 gap-12'>
                    {
                        EPhoneBook.map((item, index) => (
                            <div className='flex flex-col items-center justify-center gap-2' key={index}>
                                <img src={item.image.src} alt="Icon" className='w-20' />
                                <p className='font-semibold text-2xl'>{item.name}</p>
                                <Link href={`tel:${item.telephone}`}>
                                    <p className='flex flex-row items-center gap-2 text-xl text-[#f7740a]'><Phone /> <b>{item.telephone}</b></p>
                                </Link>
                            </div>
                        ))
                    }
                </div>
                <div>
                    <h1 className='font-bold text-4xl'>Urgent Call</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-12'>
                    {
                        PhoneBook.map((item, index) => (
                            <div className='flex flex-col items-center justify-center gap-2' key={index}>
                                <img src={item.image.src} alt="Icon" className='w-20' />
                                <p className='font-semibold text-2xl text-center'>{item.name}</p>
                                <Link href={`tel:${item.telephone}`}>
                                    <p className='flex flex-row items-center gap-2 text-xl text-[#f7740a]'><Phone /> <b>{item.telephone}</b></p>
                                </Link>
                            </div>
                        ))
                    }
                </div>
            </main>
        </>
    )
}

export default page