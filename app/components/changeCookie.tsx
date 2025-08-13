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

function ChangeCookie() {
    const t = useTranslations('NavBar');
    const [modalO, setModalO] = useState(false);
    const [wlang, setWlang] = useState('us');

    return (
        <>
            <DropdownMenuContent>
                <DropdownMenuLabel>{t(`list.switcherlang`)}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setCookie('NEXT_LOCALE', 'en', {}); window.location.reload(); }}><Flag code={'us'} className="w-5 h-5 object-cover rounded-full" /> English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setWlang('cn'); setModalO(true); }}><Flag code={'cn'} className="w-5 h-5 object-cover rounded-full" /> 中文</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setWlang('ru'); setModalO(true); }}><Flag code={'ru'} className="w-5 h-5 object-cover rounded-full" /> Русский язык</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setWlang('kr'); setModalO(true); }}><Flag code={'kr'} className="w-5 h-5 object-cover rounded-full" /> 한국어</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setWlang('my'); setModalO(true); }}><Flag code={'my'} className="w-5 h-5 object-cover rounded-full" /> bahasa Malaysia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setWlang('th'); setModalO(true); }}><Flag code={'th'} className="w-5 h-5 object-cover rounded-full" /> ภาษาไทย</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setWlang('jp'); setModalO(true); }}><Flag code={'jp'} className="w-5 h-5 object-cover rounded-full" /> 日本語</DropdownMenuItem>
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
                        <DialogClose asChild className='p-2 px-5 rounded-xl border-2 cursor-pointer'>
                            <Button variant="outline">{t('lang.cancel')}</Button>
                        </DialogClose>
                        <Button className='bg-[#f7740a] hover:bg-white hover:text-[#f7740a] hover:border-[#f7740a] border-2 border-white text-white p-2 px-5 rounded-xl cursor-pointer' type="submit" onClick={() => { setCookie('NEXT_LOCALE', wlang, {}); setModalO(false); window.location.reload(); }}>{t('lang.change')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ChangeCookie