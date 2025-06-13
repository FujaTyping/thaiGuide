import { TriangleAlert } from 'lucide-react'
import React from 'react'
import Marquee from "react-fast-marquee";
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const Data = {
    type: "Earthquake",
    message: " [2 Jun 2025] An earthquake measuring 4.5 on the Richter scale was detected in the northern Thai province of Chiang Mai on Monday afternoon and it was felt in many districts of five provinces.",
    reference: "https://www.tmd.go.th/en/EarthQuake"
}

function Ealert() {
    const t = useTranslations('Crisis');

    return (
        <>
            {Data.type &&
                <>
                    <main className='bg-[#f7740a] text-white border-b-1'>
                        <Link href={Data.reference}>
                            <section className='max-w-7xl mx-auto py-1.5 px-4 items-center gap-8 relative'>
                                <div className='flex items-center gap-2 col-span-2 bg-[#f7740a] w-fit absolute z-2 pr-4'>
                                    <TriangleAlert />
                                    <h1 className='font-bold'>{t('alert')}</h1>
                                </div>
                                <Marquee className='z-0'>
                                    <p className='mr-40'>{Data.message}</p>
                                </Marquee>
                            </section>
                        </Link>
                    </main>
                </>
            }
        </>
    )
}

export default Ealert