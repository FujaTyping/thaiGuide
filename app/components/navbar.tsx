import React from 'react';
import Logo from "@/assets/icon.png";
import Image from 'next/image';
import { Menu } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

const NavItems = [
    {
        "name": "Search",
        "link": "#"
    },
    {
        "name": "Trip Planner",
        "link": "#"
    },
    {
        "name": "Places To Visit",
        "link": "#"
    },
    {
        "name": "Reward",
        "link": "#"
    },
    {
        "name": "Travel Tips",
        "link": "#"
    }
]

function Navbar() {
    return (
        <>
            <main className='border-b-1'>
                <nav className='max-w-7xl flex items-center mx-auto p-3 w-full place-content-between'>
                    <div className='flex items-center gap-1'>
                        <Image src={Logo.src} width={58} height={58} alt='Logo' />
                        <h1 className='font-bold text-2xl text-[#f7740a]'>ThaiGuide</h1>
                    </div>
                    <div className='hidden md:flex items-center gap-6 border-1 border-[#f7740a] p-2 px-6 rounded-full text-[#f7740a] font-bold'>
                        {NavItems.map((item, index) => (
                            <a key={index} href={item.link}>{item.name}</a>
                        ))}
                    </div>
                    <div className='flex md:hidden items-center gap-6 border-1 border-[#f7740a] p-2 px-6 rounded-full text-[#f7740a] font-bold'>
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
                </nav>
            </main>
        </>
    )
}

export default Navbar