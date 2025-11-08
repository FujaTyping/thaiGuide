// Require translate
"use client";

import { useEffect, useState } from 'react';
import { CircleAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ScrollNotice() {
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;

            if (currentScroll > lastScrollY && currentScroll > 100) {
                setVisible(false);
            } else {
                setVisible(true);
            }

            setLastScrollY(currentScroll);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <AnimatePresence mode="wait">
            {visible && (
                <motion.div
                    key="notice"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-0 right-[50%] translate-x-[50%] z-99 w-full md:w-fit p-4"
                >
                    <div className="bg-white flex items-center justify-center gap-2 text-primary font-semibold border-3 border-primary p-2 px-4 rounded-full w-full text-sm md:text-base shadow-md">
                        <CircleAlert />
                        <p>Some features and data may be incomplete or inaccurate</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}