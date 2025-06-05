import React from 'react';
import Card from './card';
import Details from './details';
import Qr from './qr';

function page() {
    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl'>Profile Card</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-4'>This is your personalized profile card. It displays your information, progress, and achievements within ThaiGuide.</p>
                <Card />
                <div>
                    <h1 className='font-bold text-2xl'>Details</h1>
                </div>
                <Details />
            </main>
            <Qr />
        </>
    )
}

export default page