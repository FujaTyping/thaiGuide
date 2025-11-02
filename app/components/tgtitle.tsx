import { Badge } from '@/components/ui/badge'
import React from 'react'
// import localFont from 'next/font/local'

// const MomoTrustDisplay = localFont({
//     src: '../fonts/MomoTrustDisplay.ttf',
//     variable: "--font-mono-trust-display"
// })

function TGtitle({ title, decs, badge }: { title: string, decs?: string, badge?: string }) {
    return (
        <>
            {/*className={MomoTrustDisplay.className}*/}
            <div>
                <h1 className={`font-bold text-4xl flex items-center gap-4`}>{title}
                    {badge && <Badge className='text-white bg-primary'>{badge}</Badge>}
                </h1>
                <div className='w-32 h-1.5 bg-primary mt-2'></div>
            </div>
            {decs && <p className='mt-3'>{decs}</p>}
        </>
    )
}

export default TGtitle