import TGtitle from '@/app/components/tgtitle'
import React from 'react'
import type { Metadata } from "next"
import FForm from './form'

export const metadata: Metadata = {
    title: 'ThaiGuide – Add New Badge'
}

function page() {
    return (
        <>
            <section className='tg-container'>
                <TGtitle title='Add New Badge' decs='Create a new badge to reward travelers for completing missions or exploring new places' />
                <div className='mt-5'>
                    <FForm />
                </div>
            </section>
        </>
    )
}

export default page