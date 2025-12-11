import React from 'react'
import type { Metadata } from "next"
import TGtitle from '../components/tgtitle'
import { credit } from "./source.json"
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { CircleQuestionMark } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export const metadata: Metadata = {
    title: "ThaiGuide - Credit"
}

function Page() {
    const t = useTranslations('Credit');

    return (
        <>
            <section className='tg-container'>
                <TGtitle title={t('title')} decs={t('decs')} />
                <div className="mt-2 flex flex-col gap-4">
                    {
                        credit.map((provider, index) => (
                            <div key={index}>
                                <h1 className='font-bold text-2xl mb-2 flex items-center gap-2'>{provider.provider}
                                    <Tooltip>
                                        <TooltipTrigger><CircleQuestionMark /></TooltipTrigger>
                                        <TooltipContent className='break-normal w-[350px] md:w-full'>
                                            <p>{provider.tip}</p>
                                        </TooltipContent>
                                    </Tooltip></h1>
                                <div className='flex flex-col gap-2'>
                                    {
                                        provider.source.map((source, index) => (
                                            <div className='flex flex-wrap gap-2' key={index}>
                                                <h2 className='font-semibold'>{source.author} : </h2>
                                                {source.all.map((item, index) => (
                                                    < Link href={item.link} className='flex items-center' key={index}>
                                                        {item.title}<span className={`${index + 1 == source.all.length ? "hidden" : "block"}`}>,</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>
        </>
    )
}

export default Page