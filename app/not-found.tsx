"use client";

import React from 'react';
import FOF from "@/assets/media/icon/fof.svg";
import { motion } from 'motion/react';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

function Notfound() {
    return (
        <>
            <div className='tg-container h-[70vh] flex flex-col md:flex-row items-center justify-center gap-8u md:gap-24'>
                <motion.div
                    animate={{
                        x: [0, 20, 5, -15, -10, 0],
                        rotateZ: [0, -7, 0, 0, 0, 0]
                    }}
                    transition={{
                        duration: 6,
                        ease: "easeInOut",
                        times: [0, 0.25, 0.4, 0.65, 0.8, 1],
                        repeat: Infinity,
                        repeatDelay: 1,
                    }}
                >
                    <Link href={"/"}>
                        <Tooltip>
                            <TooltipTrigger className='cursor-pointer'><img src={FOF.src} alt="Icon" className='w-42 md:w-58' /></TooltipTrigger>
                            <TooltipContent>
                                <p>Back to home</p>
                            </TooltipContent>
                        </Tooltip>
                    </Link>
                </motion.div>
                <div className='max-w-2xl'>
                    <h1 className='mb-2 font-bold text-4xl text-[#f7740a]'>404</h1>
                    <h1 className='font-bold text-3xl'>It looks like the tuk-tuk took the scenic route - and ended up here instead!</h1>
                    <p className='mt-2'>But {"don’t"} worry, every great journey has a few surprises. Why not get back on track and discover something amazing in Thailand? <b>Click the tuk-tuk to get to home</b>.</p>
                </div>
            </div>
        </>
    )
}

export default Notfound