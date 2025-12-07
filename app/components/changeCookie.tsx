"use client";

import React, { useState } from 'react'
import Flag from 'react-world-flags';
import {
    setCookie,
} from 'cookies-next/client';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';

const supportLang = [
    { code: 'cn', text: '中文' },
    { code: 'ru', text: 'Русский язык' },
    { code: 'kr', text: '한국어' },
    { code: 'my', text: 'bahasa Malaysia' },
    { code: 'th', text: 'ภาษาไทย' },
    { code: 'jp', text: '日本語' },
]

function ChangeCookie({ isAdmin }: { isAdmin: boolean }) {
    const t = useTranslations('NavBar');
    const [modalO, setModalO] = useState(false);
    const [wlang, setWlang] = useState('us');

    return (
        <>
            <DropdownMenuContent>
                <DropdownMenuLabel>{t(`list.switcherlang`)}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer' onClick={() => { setCookie('NEXT_LOCALE', 'en', {}); window.location.reload(); }}><Flag code={'us'} className="w-5 h-5 object-cover rounded-full" /> English</DropdownMenuItem>
                {
                    isAdmin ? <>
                        <DropdownMenuItem className='cursor-pointer' onClick={() => { setWlang('th'); setModalO(true); }}><Flag code={'th'} className="w-5 h-5 object-cover rounded-full" /> ภาษาไทย</DropdownMenuItem>
                    </> : <>
                        {
                            supportLang.map((lang, index) => (
                                <DropdownMenuItem key={index} className='cursor-pointer' onClick={() => { setWlang(lang.code); setModalO(true); }}><Flag code={lang.code} className="w-5 h-5 object-cover rounded-full" /> {lang.text}</DropdownMenuItem>
                            ))
                        }

                    </>
                }
                <DropdownMenuSeparator />
                <Link href={'https://crowdin.com/project/thaiguide'}>
                    <DropdownMenuItem className='cursor-pointer'>{t('lang.request')}</DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
            <Dialog open={modalO} onOpenChange={() => setModalO(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('lang.title')}</DialogTitle>
                        <p>
                            {t('lang.d0')} <b>{wlang}</b> {t('lang.d1')}
                        </p>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">{t('lang.cancel')}</Button>
                        </DialogClose>
                        <Button  type="submit" onClick={() => { setCookie('NEXT_LOCALE', wlang, {}); setModalO(false); window.location.reload(); }}>{t('lang.change')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ChangeCookie