"use client";

import { ChevronUp } from 'lucide-react';
import React from 'react';
import ScrollToTop from "react-scroll-up";

function Totop() {
    return (
        <>
            <ScrollToTop showUnder={160}>
                <div className='bg-primary text-white p-2 rounded-full'>
                    <ChevronUp />
                </div>
            </ScrollToTop>
        </>
    )
}

export default Totop