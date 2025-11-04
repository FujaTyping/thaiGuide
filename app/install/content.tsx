import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import ANDSVGV from "@/assets/media/icon/Android.svg";
import IOSSVG from "@/assets/media/icon/IOS.png";
import { useTranslations } from 'next-intl';

function Content() {
    const t = useTranslations('Install');

    return (
        <>
            <>
                <div className='mt-2'>
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue="android"
                    >
                        <AccordionItem value="android">
                            <AccordionTrigger className='text-lg md:text-xl cursor-pointer '>
                                <div className='gap-3 flex items-center'>
                                    <img src={ANDSVGV.src} alt="Icon" className='w-10 h-10' /> Android
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className='flex flex-col-reverse md:grid md:grid-cols-2 gap-4'>
                                <div className='mt-3 flex flex-col gap-4'>
                                    {
                                        Array.from({ length: 5 }).map((_, index) => (
                                            <div key={index} className='flex flex-row items-center gap-4'>
                                                <div className='text-white bg-primary w-fit p-2 px-4 font-bold text-xl rounded-full'>
                                                    {index + 1}
                                                </div>
                                                <p className='font-semibold text-lg'>{t(`android.${index + 1}`)}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className='flex items-center justify-center w-full'>
                                    <div className='bg-primary rounded-2xl p-3 py-4'>
                                        <video src="/media/CAndroidStep.mp4" loop muted autoPlay className='w-[250px]' />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="ios">
                            <AccordionTrigger className='text-lg md:text-xl cursor-pointer '>
                                <div className='gap-3 flex items-center'>
                                    <img src={IOSSVG.src} alt="Icon" className='w-10 h-10' /> IOS
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className='flex flex-col-reverse md:grid md:grid-cols-2 gap-4'>
                                <div className='mt-3 flex flex-col gap-4'>
                                    {
                                        Array.from({ length: 4 }).map((_, index) => (
                                            <div key={index} className='flex flex-row items-center gap-4'>
                                                <div className='text-white bg-primary w-fit p-2 px-4 font-bold text-xl rounded-full'>
                                                    {index + 1}
                                                </div>
                                                <p className='font-semibold text-lg'>{t(`ios.${index + 1}`)}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className='flex items-center justify-center w-full'>
                                    <div className='bg-primary rounded-2xl p-3 py-4'>
                                        <video src="/media/IOSStep.mp4" loop muted autoPlay className='w-[250px]' />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </>
        </>
    )
}

export default Content