import React from 'react';
import Link from 'next/link';
import { Activity, Mail, MessageCircleHeart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from 'next/image';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

// SDGs Goals
import G1 from "@/assets/media/sdg/1.svg";
import G2 from "@/assets/media/sdg/8.svg";
import G3 from "@/assets/media/sdg/9.svg";
import G4 from "@/assets/media/sdg/10.svg";
import G5 from "@/assets/media/sdg/11.svg";

function Footer() {
    const t = useTranslations('FooterBar');
    return (
        <>
            <main className='bg-[#f7740a] py-3 border-t-2'>
                <div className="max-w-7xl mx-auto px-3 flex flex-col md:flex-row place-content-between gap-6 md:gap-0 items-start text-white">
                    <div className='flex flex-col gap-2'>
                        <div>
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Link href={"/sdgs"}>{t('sdg')}</Link>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    <div className='flex items-center gap-3'>
                                        {[G1, G2, G3, G4, G5].map((sdgImage, index) => (
                                            <Image height={12} width={12} key={index} src={sdgImage.src} className='w-12' alt="SDGs" />
                                        ))}
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                        <p className='flex items-center gap-2'>
                            <Tooltip>
                                <TooltipTrigger><Link href={'https://kuma.siraphop.me/status/thaiguide'}><Activity /></Link></TooltipTrigger>
                                <TooltipContent>
                                    <p>{t('uptime')}</p>
                                </TooltipContent>
                            </Tooltip>
                            {t('title')}</p>
                    </div>
                    <div className='flex flex-col md:items-end gap-2'>
                        <p className='flex items-center gap-2'><Mail /> <Link href={"mailto:contact@siraphop.me"}>contact@siraphop.me</Link></p>
                        <Link href={"/feedback"} className='flex items-center gap-2'>
                            <MessageCircleHeart /> {t('feedback')}
                        </Link>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Footer