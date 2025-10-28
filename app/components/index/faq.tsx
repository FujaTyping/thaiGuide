import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from 'next-intl';

function Faq() {
    const t = useTranslations('IndexFAQ');

    return (
        <>
            <main className='max-w-7xl mx-auto px-3 py-6'>
                <h1 className='text-2xl md:text-3xl font-bold text-primary'>{t('headder')}</h1>
                <Accordion type="single" collapsible className='mt-4'>
                    {
                        Array.from({ length: 5 }).map((_, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className='text-lg md:text-xl cursor-pointer'>{t(`q.${index}`)}</AccordionTrigger>
                                <AccordionContent className='text-[1rem] md:text-[1.1rem]'>
                                    {t(`a.${index}`)}
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    }
                </Accordion>
            </main>
        </>
    )
}

export default Faq