"use client";

import React, { useState, useEffect } from 'react';
import Logo from "@/assets/icon.png";
import Image from 'next/image';
import { KeyRound, LoaderCircle, LogOut, Menu, Smile, UserRound } from 'lucide-react';
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

const NavItems = [
    {
        "name": "Search",
        "link": "#"
    },
    {
        "name": "Trip Planner",
        "link": "/planner"
    },
    {
        "name": "Road Trips",
        "link": "/roadtrip"
    },
    {
        "name": "Redeem",
        "link": "/redeem"
    }
]

function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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
            <main className='border-b-1'>
                <nav className='max-w-7xl flex items-center mx-auto p-3 w-full place-content-between'>
                    <Link href={"/"}>
                        <div className='flex items-center gap-1'>
                            <Image src={Logo.src} width={58} height={58} alt='Logo' />
                            <h1 className='font-bold text-2xl text-[#f7740a]'>ThaiGuide</h1>
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
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <div className='flex md:hidden items-center gap-6 border-1 border-[#f7740a] p-2 px-6 rounded-full text-[#f7740a] font-bold hover:bg-[#f7740a] transition-all duration-300 hover:text-white'>
                            <Sheet>
                                <SheetTrigger><p className='flex items-center gap-2'><Menu /> Menu</p></SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle className='text-2xl font-bold text-[#f7740a]'>Menu</SheetTitle>
                                        <div className='flex flex-col gap-2 mt-3 text-lg text-[#f7740a] font-semibold'>
                                            {NavItems.map((item, index) => (
                                                <a key={index} href={item.link}>{item.name}</a>
                                            ))}
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
                                        <DropdownMenuItem><Link href={"/profile"} className='flex items-center gap-2'><Smile className='text-[#f7740a]' /> Profile</Link></DropdownMenuItem>
                                        <DropdownMenuItem className='flex items-center gap-2' onClick={handleLogout}><LogOut className='text-[#f7740a]' /> Logout</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu> : <KeyRound onClick={handleGoogleSignIn} />}
                            </>}
                        </div>
                    </div>
                </nav>
            </main>
        </>
    )
}

export default Navbar