import React from 'react';
import Image from 'next/image';
import type { Metadata } from "next";
import { useTranslations } from 'next-intl';
import Didyouknow from "@/app/components/didyouknow";

export const metadata: Metadata = {
    title: "ThaiGuide – Sustainable Development Goals"
};

// SDGs Goals
import G1 from "@/assets/media/sdg/1.svg";
import G2 from "@/assets/media/sdg/8.svg";
import G3 from "@/assets/media/sdg/9.svg";
import G4 from "@/assets/media/sdg/10.svg";
import G5 from "@/assets/media/sdg/11.svg";

const Data = [
    {
        image: G1,
        id: 1,
    },
    {
        image: G2,
        id: 8,
    },
    {
        image: G3,
        id: 9,
    },
    {
        image: G4,
        id: 10,
    },
    {
        image: G5,
        id: 11,
    }
]

function Page() {
    const t = useTranslations('SDG');

    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>{t('title')}</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-3'>{t('decs')}</p>
                <div className='flex flex-col gap-10 md:gap-6 mt-8'>
                    {Data.map((item) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-6">
                            <Image src={item.image.src} alt={t(`goal.${item.id}.title`)} width={120} height={120} className="object-contain mb-4" />
                            <div>
                                <h2 className="text-2xl font-semibold text-[#f7740a] mb-1">{t(`goal.${item.id}.title`)}</h2>
                                <p>{t(`goal.${item.id}.decs`)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Didyouknow />
        </>
    )
}

export default Page