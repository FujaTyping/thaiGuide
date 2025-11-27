"use client";

import React, { useState, useEffect } from 'react';
import Logo from "@/assets/icon.png";
import Image from 'next/image';
import { Columns3Cog, KeyRound, Languages, LoaderCircle, LogOut, MapPinned, Menu, Settings2, Smile, Trophy, UserRound } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { AnimatePresence, motion } from "motion/react";
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
    deleteCookie,
    getCookie
} from 'cookies-next/client';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signInWithEmailAndPassword } from "firebase/auth";
import SearchModal from './searchModal';

// Modal Icon
import LIC from "@/assets/media/login/left.png";
import CIC from "@/assets/media/login/center.png";
import RIC from "@/assets/media/login/right.png";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const NavItems = [
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
    const [wantAd, setWantAd] = useState(false);
    const [isAd, setIsAd] = useState<boolean>(false);
    const [searchToogle, setSearchToogle] = useState(false);
    const [toggleNavbar, setToggleNavbar] = useState(false);

    const adminFormSchema = z.object({
        email: z.string().min(11, t('login.admin.require.username')),
        password: z.string().min(12, t('login.admin.require.pwd'))
    })

    const form = useForm<z.infer<typeof adminFormSchema>>({
        resolver: zodResolver(adminFormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    onAuthStateChanged(auth, (user) => {
        if (user && getCookie('traveler_session')) {
            setUser(user);
            setLoading(false);
            const userperms = getCookie('traveler_session')?.split('--')
            if (userperms && userperms[1]) {
                setIsAd(true);
            }
        } else {
            setUser(null);
            setLoading(false);
        }
    });

    async function registerServiceWorker() {
        await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none',
        })
    }

    useEffect(() => {
        registerServiceWorker();
        analyticsPromise.then((analytics) => {
            if (analytics) {
                logEvent(analytics, "page_view");
            }
        });
    }, []);

    useEffect(() => {
        async function checkStats() {
            try {
                await axios.get(`${server}/db/info`)
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
            setCookie('traveler_session', `${btoa(result.user.uid)}`, {
                secure: true,
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 365
            })
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

    function onSubmit(values: z.infer<typeof adminFormSchema>) {
        toast(t('login.ing'), {
            icon: <LoaderCircle size={18} className='animate-spin' />
        });
        signInWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                const user = userCredential.user;
                setCookie('traveler_session', `${btoa(user.uid)}--admin`, {
                    secure: true,
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 365
                });
                toast.success(`${t('login.done')} ${user.email}`, {
                    description: t('login.donedecs'),
                    action: {
                        label: t('login.logout'),
                        onClick: handleLogout,
                    },
                })
                setUser(user);
                setLoginM(false);
                router.push('/@me');
            })
            .catch((error) => {
                toast.error(`${t('login.e')}: ${error.message}`);
            });
    }
    return (
        <>
            <main className='border-b-10 border-primary'>
                <nav className='max-w-7xl flex items-center mx-auto p-3 w-full place-content-between'>
                    <Link href={"/"}>
                        <div className='flex items-center gap-1'>
                            <Image src={Logo.src} width={58} height={58} alt='Logo' />
                            <h1 className='font-bold text-2xl text-primary'>{t('title')}</h1>
                        </div>
                    </Link>
                    <div className='flex items-center gap-2'>
                        <div className='hidden md:flex items-center gap-6 border-1 border-primary p-2 px-6 rounded-full text-primary font-bold hover:bg-primary transition-all duration-300 group'>
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.8 }}
                                onClick={() => setSearchToogle(true)}
                            >
                                <p className='group-hover:text-white cursor-pointer'>
                                    {t('list.search')}
                                </p>
                            </motion.div>
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
                        <div className='flex md:hidden items-center gap-6 border-1 border-primary p-2 px-6 rounded-full text-primary font-bold hover:bg-primary transition-all duration-300 hover:text-white'>
                            <Sheet open={toggleNavbar} onOpenChange={setToggleNavbar}>
                                <SheetTrigger><p className='flex items-center gap-2'><Menu /> {t('menu')}</p></SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle className='text-2xl font-bold text-primary'>{t('menu')}</SheetTitle>
                                        <div className='flex flex-col gap-2 mt-3 text-lg text-primary font-semibold'>
                                            <p className='cursor-pointer' onClick={() => { setToggleNavbar(false); setSearchToogle(true) }}>{t('list.search')}</p>
                                            <Link onClick={() => setToggleNavbar(false)} href={"/activity"}>{tb(`item.activity`)}</Link>
                                            <Link onClick={() => setToggleNavbar(false)} href={"/restaurant"}>{tb(`item.restaurant`)}</Link>
                                            {NavItems.map((item, index) => (
                                                <Link onClick={() => setToggleNavbar(false)} key={index} href={item.link}>{t(`list.${item.name}`)}</Link>
                                            ))}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <div className='group-hover:text-white cursor-pointer flex items-center gap-3 text-left mt-8'>
                                                        <Languages /> {t(`list.switcher`)}
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <ChangeCookie isAdmin={isAd} />
                                            </DropdownMenu>
                                        </div>
                                    </SheetHeader>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <div className='flex items-center gap-6 border-1 border-primary p-2 px-2 rounded-full text-primary font-bold hover:bg-primary transition-all duration-300 hover:text-white cursor-pointer'>
                            {loading ? <>
                                <LoaderCircle className='animate-spin' />
                            </> : <>
                                {user ? <DropdownMenu>
                                    <DropdownMenuTrigger><UserRound className='cursor-pointer' /></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {isAd && <Link href={"/dashboard"}><DropdownMenuItem className='flex items-center gap-2 cursor-pointer'><Columns3Cog className='text-primary' /> {t('dashboard')}</DropdownMenuItem></Link>}
                                        {!isAd &&
                                            <>
                                                <Link href={"/@me"}><DropdownMenuItem className='flex items-center gap-2 cursor-pointer'><Smile className='text-primary' /> {t('profile')}</DropdownMenuItem></Link>
                                                <Link href={"/@me/mymap"}><DropdownMenuItem className='flex items-center gap-2 cursor-pointer'><MapPinned className='text-primary' /> {t('map')}</DropdownMenuItem></Link>
                                                <Link href={"/leaderboard"}><DropdownMenuItem className='flex items-center gap-2 cursor-pointer'><Trophy className='text-primary' /> {t('leaderboard')}</DropdownMenuItem></Link>
                                                <Link href={"/@me/option"}><DropdownMenuItem className='flex items-center gap-2 cursor-pointer'><Settings2 className='text-primary' /> {t('account')}</DropdownMenuItem></Link>
                                            </>
                                        }
                                        <DropdownMenuItem className='flex items-center gap-2 cursor-pointer' onClick={handleLogout}><LogOut className='text-primary' /> {t('logout')}</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu> : <KeyRound onClick={() => setLoginM(true)} />}
                            </>}
                        </div>
                        <div className='hidden md:flex items-center gap-6 border-1 border-primary p-2 px-2 rounded-full text-primary font-bold hover:bg-primary transition-all duration-300 hover:text-white cursor-pointer'>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Languages className='cursor-pointer' />
                                </DropdownMenuTrigger>
                                <ChangeCookie isAdmin={isAd} />
                            </DropdownMenu>
                        </div>
                    </div>
                </nav>
            </main>
            <Dialog open={loginM} onOpenChange={setLoginM} >
                <DialogContent>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={wantAd ? 'show' : 'hide'}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {
                                wantAd ? <>
                                    <DialogHeader>
                                        <DialogTitle className='text-2xl'>{t('login.admin.title')}</DialogTitle>
                                        <p>{t('login.admin.decs')}</p>
                                    </DialogHeader>
                                    <div className='mt-3'>
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>{t('login.admin.form.username')}</FormLabel>
                                                            <FormControl>
                                                                <Input type='email' placeholder="name@thaiguide.in.th" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="password"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>{t('login.admin.form.pwd')}</FormLabel>
                                                            <FormControl>
                                                                <Input type='password' placeholder="••••••••••••" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button type="submit" className='w-full cursor-pointer bg-primary hover:bg-primary text-white'><KeyRound />{t('login.admin.login')}</Button>
                                            </form>
                                        </Form>
                                    </div>
                                </> : <>
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
                                    <div className='mt-3'>
                                        <Button onClick={handleGoogleSignIn} className='w-full bg-primary hover:bg-primary cursor-pointer'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-brand-google"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" /></svg>
                                            {t('login.modal.withgoogle')}</Button>
                                    </div>
                                </>
                            }
                        </motion.div>
                    </AnimatePresence>
                    <div className='space-y-1'>
                        <p className='text-sm text-center'>{t('login.ac1')} <Link onClick={() => setLoginM(false)} href={'/terms'} className='text-primary font-semibold'>{t('login.terms')}</Link> {t('login.ac2')} <Link onClick={() => setLoginM(false)} href={'/privacy'} className='text-primary font-semibold'>{t('login.privacy')}</Link></p>
                        <p onClick={() => setWantAd(!wantAd)} className='text-center text-primary font-semibold text-sm cursor-pointer'>{wantAd ? t('login.switcherTra') : t('login.switcherAd')}</p>
                    </div>
                </DialogContent>
            </Dialog>
            <SearchModal open={searchToogle} setOpen={setSearchToogle} />
        </>
    )
}

export default Navbar