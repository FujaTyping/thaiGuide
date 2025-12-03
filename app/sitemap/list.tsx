"use client";

import React, { useState, useEffect } from 'react'
import TGtitle from '../components/tgtitle'
import { uLinks } from "./page.json";
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import auth from '@/lib/firebaseAuth';
import { useTranslations } from 'next-intl';

function List() {
    const t = useTranslations("Sitemap");
    const [show, setShow] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setShow(true);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            {
                show && <>
                    <TGtitle title={t('utitle')} decs={t('udecs')} second={true} />
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4'>
                        {
                            uLinks.map((item, key) => (
                                <div key={key} className='flex items-center justify-center text-center'>
                                    <Link href={item.link}>
                                        <h1 className='light:text-primary font-bold text-lg'>{t(`ulinks.${item.title}`)}</h1>
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
                </>
            }
        </>
    )
}

export default List