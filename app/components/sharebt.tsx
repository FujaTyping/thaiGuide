"use client";

import { Share2 } from 'lucide-react';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SocialIcon } from 'react-social-icons';

function Sharebt({ link, onlyContent }: { link?: string, onlyContent?: boolean }) {
    const pathname = usePathname();
    const t = useTranslations('Share');
    const fullPath = link || `https://www.thaiguide.in.th${pathname}`

    const shareLink = [
        `https://www.reddit.com/submit?url=${fullPath}&title=&type=LINK`,
        `https://x.com/intent/post?url=${fullPath}&text=`,
        `https://telegram.me/share/url?url=${fullPath}&text=`,
        `https://www.facebook.com/sharer/sharer.php?u=${fullPath}&text=`
    ]

    if (onlyContent) return (
        <>
            <div className='flex items-center justify-center gap-3'>
                {
                    shareLink.map((link, index) => (
                        <SocialIcon bgColor='#f7740a' key={index} url={link} style={{ height: 45, width: 45 }} />
                    ))
                }
            </div>
            <p className='text-sm text-primary font-semibold text-center mt-1 break-all'>{fullPath}</p>
        </>
    )

    return (
        <>
            <Dialog>
                <DialogTrigger>
                    <div className='fixed bottom-0 right-0 p-4 z-5'>
                        <div className='bg-primary text-white p-3 rounded-full hover:bg-white hover:text-primary border-2 border-primary transition-all duration-250 cursor-pointer'>
                            <Share2 className='size-8' />
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('title')}</DialogTitle>
                        <p className='mb-4'>{t('decs')}</p>
                        <div className='flex items-center justify-center gap-3'>
                            {
                                shareLink.map((link, index) => (
                                    <SocialIcon bgColor='#f7740a' key={index} url={link} style={{ height: 45, width: 45 }} />
                                ))
                            }
                        </div>
                        <p className='text-sm text-primary font-semibold text-center mt-1 break-all'>{fullPath}</p>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Sharebt