"use client";

import { Share2 } from 'lucide-react';
import React from 'react';
import { ShareSocial } from 'react-share-social';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import './share.css'

const style = {
    root: {
        borderRadius: 3,
        border: 0,
        padding: 0,
        color: 'white',
    },
    copyContainer: {
        background: '#f7740a',
        border: 0
    }
};

function Sharebt() {
    const pathname = usePathname();
    const t = useTranslations('Share');

    return (
        <>
            <Dialog>
                <DialogTrigger>
                    <div className='fixed bottom-0 right-0 p-4'>
                        <div className='bg-[#f7740a] text-white p-3 rounded-full hover:bg-white hover:text-[#f7740a] border-2 border-[#f7740a] transition-all duration-250 cursor-pointer'>
                            <Share2 className='size-8' />
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('title')}</DialogTitle>
                        <p className='mb-4'>{t('decs')}</p>
                        <div className='flex items-center justify-center'>
                            <ShareSocial
                                url={`https://thaiguide.siraphop.me${pathname}`}
                                style={style}
                                socialTypes={['facebook', 'twitter', 'reddit', 'line', 'telegram']}
                            />
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Sharebt