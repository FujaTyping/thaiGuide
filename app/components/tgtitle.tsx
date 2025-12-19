"use client";

import { Badge } from '@/components/ui/badge'
import React, { useEffect, useState } from 'react'
import localFont from 'next/font/local'

const MomoTrustDisplay = localFont({
    src: '../fonts/BevellierMedium.ttf',
    variable: "--font-bevellier-medium"
})

function TGtitle({ title, decs, badge, second }: { title: string, decs?: string, badge?: string, second?: boolean }) {
    const [rotation, setRotation] = useState(-0.3);

    useEffect(() => {
        setRotation(Math.random() * 0.6 - 0.3);
    }, []);

    return (
        <>
            <main className={`${second && 'mt-6'}`}>
                <div>
                    <div className='flex items-center gap-4'>
                        <h1 className={`hidden md:flex items-center font-bold text-4xl md:text-5xl ${MomoTrustDisplay.className}`}>
                            <span style={{ transform: `rotate(${rotation}rad)` }} className='text-white bg-primary p-1 px-1.5 z-0 rounded-sm'>{title.charAt(0).toUpperCase()}</span>
                            <span className='z-1'>{title.slice(1)}</span>
                        </h1>
                        <h1 className={`md:hidden font-bold text-4xl md:text-5xl flex items-center gap-4 ${MomoTrustDisplay.className}`}>{title}</h1>
                        {badge && <Badge className='text-white bg-primary'>{badge}</Badge>}
                    </div>
                    <div className={`w-32 h-1.5 bg-primary mt-2.5 ${!decs && 'mb-5'}`}></div>
                </div>
                {decs && <p className='mt-3'>{decs}</p>}
            </main>

        </>
    )
}

export default TGtitle