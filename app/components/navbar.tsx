"use client";

import React, { useState, useEffect } from 'react';
import Logo from "@/assets/icon.png";
import Image from 'next/image';
import { KeyRound, Languages, LoaderCircle, LogOut, MapPinned, Menu, Smile, Trophy, UserRound } from 'lucide-react';
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
import { toast } from "sonner"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ChangeCookie from './changeCookie';
import { server } from "@/app/config.json";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import {
    setCookie,
    deleteCookie
} from 'cookies-next/client';

// Modal Icon
import LIC from "@/assets/media/login/left.png";
import CIC from "@/assets/media/login/center.png";
import RIC from "@/assets/media/login/right.png";

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
    const router = useRouter()
    const t = useTranslations('NavBar');
    const tb = useTranslations('ToolBar');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loginM, setLoginM] = useState(false);

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

    useEffect(() => {
        async function checkStats() {
            try {
                await axios.get(`https://${server}/db/info`)
            } catch (error) {
                toast.error(t('servererror'), {
                    description: `${error}`,
                    action: {
                        label: `${t('statsbtn')}`,
                        onClick: () => { router.push('https://kuma.siraphop.me/status/thaiguide') },
                    },
                });
            }
        }
        checkStats()
    }, []);

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            toast(t('login.ing'), {
                icon: <LoaderCircle size={18} className='animate-spin' />
            });
            const result = await signInWithPopup(auth, provider);
            toast.success(`${t('login.done')} ${result.user.email}`, {
                description: t('login.donedecs'),
                action: {
                    label: t('login.logout'),
                    onClick: handleLogout,
                },
            })
            setUser(result.user);
            setLoginM(false);
            setCookie('traveler_session', result.user.uid, {})
            router.push('/@me');
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Error signing in:", error);
                toast.error(`${t('login.e')}: ${error.message}`);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            deleteCookie('traveler_session');
            toast.success(t('login.out'));
            router.push('/');
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
                                                    <div className='group-hover:text-white cursor-pointer flex items-center gap-3 text-left mt-8'>
                                                        <Languages /> {t(`list.switcher`)}
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <ChangeCookie />
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
                                        <Link href={"/@me"}><DropdownMenuItem className='flex items-center gap-2 cursor-pointer'><Smile className='text-[#f7740a]' /> {t('profile')}</DropdownMenuItem></Link>
                                        <Link href={"/@me/mymap"}><DropdownMenuItem className='flex items-center gap-2 cursor-pointer'><MapPinned className='text-[#f7740a]' /> {t('map')}</DropdownMenuItem></Link>
                                        <Link href={"/leaderboard"}><DropdownMenuItem className='flex items-center gap-2 cursor-pointer'><Trophy className='text-[#f7740a]' /> {t('leaderboard')}</DropdownMenuItem></Link>
                                        <DropdownMenuItem className='flex items-center gap-2 cursor-pointer' onClick={handleLogout}><LogOut className='text-[#f7740a]' /> {t('logout')}</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu> : <KeyRound onClick={() => setLoginM(true)} />}
                            </>}
                        </div>
                        <div className='hidden md:flex items-center gap-6 border-1 border-[#f7740a] p-2 px-2 rounded-full text-[#f7740a] font-bold hover:bg-[#f7740a] transition-all duration-300 hover:text-white cursor-pointer'>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Languages className='cursor-pointer' />
                                </DropdownMenuTrigger>
                                <ChangeCookie />
                            </DropdownMenu>
                        </div>
                    </div>
                </nav>
            </main>
            <Dialog open={loginM} onOpenChange={setLoginM}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>{t('login.modal.title')}</DialogTitle>
                        <div className='flex items-center justify-center py-2'>
                            <div className='flex items-end gap-2'>
                                <img src={LIC.src} alt="Icon" className='w-16 md:w-18' />
                                <img src={CIC.src} alt="Icon" className='w-22 md:w-24' />
                                <img src={RIC.src} alt="Icon" className='w-16 md:w-18' />
                            </div>
                        </div>
                        <p>{t('login.modal.decs')}</p>
                    </DialogHeader>
                    <div>
                        <Button onClick={handleGoogleSignIn} className='w-full bg-[#f7740a] hover:bg-[#f7740a] cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-brand-google"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" /></svg>
                            {t('login.modal.withgoogle')}</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Navbar