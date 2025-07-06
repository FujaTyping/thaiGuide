"use client";

import React, { useState, useEffect } from 'react';
import Logo from "@/assets/icon.png";
import Image from 'next/image';
import { KeyRound, Languages, LoaderCircle, LogOut, Menu, Smile, Trophy, UserRound } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "motion/react";
import Link from 'next/link';
import { FirebaseError } from 'firebase/app';
import { signInWithPopup, GoogleAuthProvider, User, onAuthStateChanged, signOut } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { analyticsPromise } from "@/lib/firebaseAnalytics";
import { logEvent } from "firebase/analytics";
import { useTranslations } from 'next-intl';
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

const NavItems = [
    {
        "name": "weather",
        "link": "/weather"
    },
    {
        "name": "planner",
        "link": "/planner"
    },
    {
        "name": "trips",
        "link": "/roadtrip"
    },
    {
        "name": "redeem",
        "link": "/redeem"
    }
]

function Navbar() {
    const t = useTranslations('NavBar');
    const tb = useTranslations('ToolBar');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalO, setModalO] = useState(false);
    const [wlang, setWlang] = useState('us');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        analyticsPromise.then((analytics) => {
            if (analytics) {
                logEvent(analytics, "page_view");
            }
        });
    }, []);


    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Error signing in:", error);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };
    return (
        <>
            <main className='border-b-10 border-[#f7740a]'>
                <nav className='max-w-7xl flex items-center mx-auto p-3 w-full place-content-between'>
                    <Link href={"/"}>
                        <div className='flex items-center gap-1'>
                            <Image src={Logo.src} width={58} height={58} alt='Logo' />
                            <h1 className='font-bold text-2xl text-[#f7740a]'>{t('title')}</h1>
                        </div>
                    </Link>
                    <div className='flex items-center gap-2'>
                        <div className='hidden md:flex items-center gap-6 border-1 border-[#f7740a] p-2 px-6 rounded-full text-[#f7740a] font-bold hover:bg-[#f7740a] transition-all duration-300 group'>
                            {NavItems.map((item, index) => (
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    whileTap={{ scale: 0.8 }}
                                    key={index}
                                >
                                    <Link href={item.link} className='group-hover:text-white'>
                                        {t(`list.${item.name}`)}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <div className='flex md:hidden items-center gap-6 border-1 border-[#f7740a] p-2 px-6 rounded-full text-[#f7740a] font-bold hover:bg-[#f7740a] transition-all duration-300 hover:text-white'>
                            <Sheet>
                                <SheetTrigger><p className='flex items-center gap-2'><Menu /> {t('menu')}</p></SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle className='text-2xl font-bold text-[#f7740a]'>{t('menu')}</SheetTitle>
                                        <div className='flex flex-col gap-2 mt-3 text-lg text-[#f7740a] font-semibold'>
                                            <a href={"/activity"}>{tb(`item.activity`)}</a>
                                            <a href={"/restaurant"}>{tb(`item.restaurant`)}</a>
                                            {NavItems.map((item, index) => (
                                                <a key={index} href={item.link}>{t(`list.${item.name}`)}</a>
                                            ))}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <div className='group-hover:text-white cursor-pointer text-left mt-8'>
                                                        {t(`list.switcher`)}
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>{t(`list.switcherlang`)}</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => { setCookie('NEXT_LOCALE', 'en', {}); window.location.reload(); }}><Flag code={'us'} className="w-5 h-5 object-cover rounded-full" /> English</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setWlang('cn'); setModalO(true); }}><Flag code={'cn'} className="w-5 h-5 object-cover rounded-full" /> 中文</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setWlang('ru'); setModalO(true); }}><Flag code={'ru'} className="w-5 h-5 object-cover rounded-full" /> Русский язык</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setWlang('kr'); setModalO(true); }}><Flag code={'kr'} className="w-5 h-5 object-cover rounded-full" /> 한국어</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setWlang('my'); setModalO(true); }}><Flag code={'my'} className="w-5 h-5 object-cover rounded-full" /> bahasa Malaysia</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setWlang('th'); setModalO(true); }}><Flag code={'th'} className="w-5 h-5 object-cover rounded-full" /> ภาษาไทย</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </SheetHeader>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <div className='flex items-center gap-6 border-1 border-[#f7740a] p-2 px-2 rounded-full text-[#f7740a] font-bold hover:bg-[#f7740a] transition-all duration-300 hover:text-white cursor-pointer'>
                            {loading ? <>
                                <LoaderCircle className='animate-spin' />
                            </> : <>
                                {user ? <DropdownMenu>
                                    <DropdownMenuTrigger><UserRound className='cursor-pointer' /></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <Link href={"/profile"} className='flex items-center gap-2'><DropdownMenuItem><Smile className='text-[#f7740a]' /> {t('profile')}</DropdownMenuItem></Link>
                                        <Link href={"/leaderboard"}><DropdownMenuItem className='flex items-center gap-2'><Trophy className='text-[#f7740a]' /> {t('leaderboard')}</DropdownMenuItem></Link>
                                        <DropdownMenuItem className='flex items-center gap-2' onClick={handleLogout}><LogOut className='text-[#f7740a]' /> {t('logout')}</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu> : <KeyRound onClick={handleGoogleSignIn} />}
                            </>}
                        </div>
                        <div className='hidden md:flex items-center gap-6 border-1 border-[#f7740a] p-2 px-2 rounded-full text-[#f7740a] font-bold hover:bg-[#f7740a] transition-all duration-300 hover:text-white cursor-pointer'>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Languages className='cursor-pointer' />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>{t(`list.switcherlang`)}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => { setCookie('NEXT_LOCALE', 'en', {}); window.location.reload(); }}><Flag code={'us'} className="w-5 h-5 object-cover rounded-full" /> English</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setWlang('cn'); setModalO(true); }}><Flag code={'cn'} className="w-5 h-5 object-cover rounded-full" /> 中文</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setWlang('ru'); setModalO(true); }}><Flag code={'ru'} className="w-5 h-5 object-cover rounded-full" /> Русский язык</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setWlang('kr'); setModalO(true); }}><Flag code={'kr'} className="w-5 h-5 object-cover rounded-full" /> 한국어</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setWlang('my'); setModalO(true); }}><Flag code={'my'} className="w-5 h-5 object-cover rounded-full" /> bahasa Malaysia</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setWlang('th'); setModalO(true); }}><Flag code={'th'} className="w-5 h-5 object-cover rounded-full" /> ภาษาไทย</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </nav>
            </main>
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

export default Navbar