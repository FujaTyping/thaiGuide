"use client";

import React, { useRef, useState } from 'react';
import { WebCamera, WebCameraHandler } from "@shivantra/react-web-camera";
import { Camera, Download, RotateCcw, SwitchCamera } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import NF from "@/assets/media/card/icon/notfound.svg";
import { useTranslations } from 'next-intl';

function Cam() {
    const cameraHandler = useRef<WebCameraHandler>(null);
    const [images, setImages] = useState<string | null>();
    const [error, setError] = useState<string>('');
    const t = useTranslations('camera');

    async function handleCapture() {
        const file = await cameraHandler.current?.capture();
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                if (reader.result) {
                    setImages(reader.result as string);
                }
            };
        }
    }

    function handleSwitch() {
        cameraHandler.current?.switch();
    }

    function handleDownload() {
        if (images) {
            const link = document.createElement('a');
            link.href = images;
            link.download = `thaiguide-capture-${Date.now()}.jpeg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    return (
        <>
            <div className='tg-container -mt-4'>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={images ? "photo" : "camera"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {
                            error ? <>
                                <div className='flex items-center flex-col justify-center gap-4 py-4'>
                                    <motion.div
                                        animate={{
                                            x: [0, -10, 10, -10, 10, -5, 5, 0],
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <img src={NF.src} alt="Icon" className='w-32' />
                                    </motion.div>
                                    <p className='font-semibold'>{t('err')} : {error}</p>
                                </div>
                            </> : <>
                                {
                                    images ? <div className='relative'>
                                        <div className='absolute bottom-4 flex items-end gap-2 justify-center w-full text-white'>
                                            <div className='tg-btn rounded-full p-2' onClick={handleDownload}><Download /></div>
                                            <div className='tg-btn rounded-full p-2' onClick={() => setImages(null)}><RotateCcw /></div>
                                        </div>
                                        <img src={images} alt='Photo' className='w-full' />
                                    </div>
                                        : <div className='relative'>
                                            <div className='absolute bottom-4 flex items-end gap-2 justify-center w-full text-white'>
                                                <div className='tg-btn rounded-full h-14 w-14 md:w-18 md:h-18 flex items-center justify-center' onClick={handleCapture}><Camera className='w-8 h-8 md:w-10 md:h-10' /></div>
                                                <div className='tg-btn rounded-full p-2' onClick={handleSwitch}><SwitchCamera /></div>
                                            </div>
                                            <WebCamera
                                                className="camera-container"
                                                videoClassName="camera-video"
                                                captureMode="front"
                                                captureQuality={1}
                                                ref={cameraHandler}
                                                getFileName={() => `thaiguide-${Date.now()}.jpeg`}
                                                onError={(err) => setError(err.message)}
                                            />
                                        </div>
                                }
                            </>
                        }

                    </motion.div>
                </AnimatePresence >
            </div>
        </>
    )
}

export default Cam