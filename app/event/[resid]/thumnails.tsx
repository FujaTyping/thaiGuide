"use client";

import React from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';

function Thumnails({ image }: { image: string }) {
    return (
        <>
            <PhotoProvider
                speed={() => 800}
                easing={(type) => (type === 2 ? 'cubic-bezier(0.36, 0, 0.66, -0.56)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)')}
                maskOpacity={0.4}
            >
                <PhotoView src={image}>
                    <img src={image} alt="Event" className='w-full rounded-2xl cursor-pointer h-fit' />
                </PhotoView>
            </PhotoProvider>
        </>
    )
}

export default Thumnails