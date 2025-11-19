import React from 'react';
import type { Metadata } from 'next';
import TGtitle from '@/app/components/tgtitle';
import Content from './content';

export const metadata: Metadata = {
    title: 'ThaiGuide – Badge Management'
}

function Page() {
    return (
        <>
            <main className='tg-container w-full'>
                <TGtitle title='Badge Control Center' decs='Oversee badge creation, updates, and availability in the ThaiGuide system' />
                <div className='mt-4 w-full'>
                    <Content />
                </div>
            </main>
        </>
    )
}

export default Page