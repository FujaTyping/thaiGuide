import { TriangleAlert } from 'lucide-react'
import React from 'react'
import Marquee from "react-fast-marquee";
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const Data = {
    type: "Earthquake",
    message: "[Jun 2025] The situation at the Thai-Cambodian border is currently highly tense due to recent armed clashes and prolonged diplomatic conflicts, including trade bans and internet blackouts. This creates high risks and uncertainty for travelers. Non-essential travel to disputed areas is strongly discouraged.",
    reference: "https://www.nationthailand.com/news/general/40051341"
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