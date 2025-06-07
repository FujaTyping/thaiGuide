import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = [
    {
        question: "When is the best time to travel to Thailand?",
        answer: "The best seasons for traveling in Thailand are the cool season and the hot season. The most popular travel period is from November to April. However, Thailand is a country with interesting activities, festivals, or traditions throughout the year across the country, and various natural attractions can be visited year-round. Therefore, tourists can choose to travel at any time of the year, depending on their convenience."
    },
    {
        question: "What is the climate of Thailand like?",
        answer: "Thailand has a tropical climate. The area is influenced by the southwest monsoon blowing from the Indian Ocean, causing the rainy season, and the northeast monsoon blowing from the South China Sea, causing the cool season. The average temperature throughout the year is about 18-34 degrees Celsius."
    },
    {
        question: "Do I need a visa to visit Thailand?",
        answer: "Visa requirements for Thailand depend on your nationality and the length of your stay. Many nationalities are eligible for a visa exemption or visa on arrival for tourist purposes for a certain period. It's best to check the latest requirements with the Royal Thai Embassy or Consulate in your country before your trip."
    },
    {
        question: "What currency is used in Thailand?",
        answer: "The official currency of Thailand is the Thai Baht (THB). You can exchange your currency for Thai Baht at airports, banks, and authorized money changers throughout the country. Credit cards are widely accepted in hotels, larger restaurants, and shopping malls, but it's advisable to carry some cash for smaller vendors and local markets."
    },
    {
        question: "What language is spoken in Thailand? Will I be able to communicate in English?",
        answer: "The official language of Thailand is Thai. However, in major tourist areas, hotels, and popular attractions, English is commonly spoken and understood, especially by those working in the tourism industry. Learning a few basic Thai phrases like 'Sawasdee' (Hello/Goodbye) and 'Khop Khun' (Thank you) can be appreciated by locals."
    },
]

function Faq() {
    return (
        <>
            <main className='max-w-7xl mx-auto px-3 py-6'>
                <h1 className='text-2xl md:text-3xl font-bold text-[#f7740a]'>Frequently Asked Question</h1>
                <Accordion type="single" collapsible className='mt-4'>
                    {
                        FAQ.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className='text-lg md:text-xl cursor-pointer'>{item.question}</AccordionTrigger>
                                <AccordionContent className='text-[1rem] md:text-[1.1rem]'>
                                    {item.answer}
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