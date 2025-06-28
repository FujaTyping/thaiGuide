"use client";

import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import Loader from '../components/loader';
import axios from 'axios';
import { server } from "@/app/config.json";
import check from "@/assets/media/icon/check.png";
import { useTranslations } from 'next-intl';

import NF from "@/assets/media/card/icon/notfound.png";

interface QQuizz {
    quizName: string;
    completedAt: {
        seconds: number;
    }
}

function Quiz() {
    const t = useTranslations('Profile');
    const [user, setUser] = useState<User | null>(null);
    const [quizz, setQuizz] = useState<QQuizz[] | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const checkUser = await axios.put(`https://${server}/quiz/getbyuser`, {
                    userId: user.uid
                })
                setQuizz(checkUser.data.completedQuizzes);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!user || !quizz) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        )
    }

    return (
        <>
            <div className='grid grid-cols-1 gap-4 mt-4'>
                {
                    quizz.length == 0 ? <>
                        <div className='flex items-center flex-col justify-center py-8 gap-4'>
                            <img src={NF.src} alt="Icon" className='w-28 translate-x-3' />
                            <p className='font-semibold'>{t('quiz.noneed')}</p>
                        </div>
                    </> : <>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                            {
                                quizz.map((item, index: number) => (
                                    <div key={index} className='w-full border-3 border-[#f7740a] p-5 py-3 rounded-xl flex flex-col items-center justify-center'>
                                        <img src={check.src} alt="Icon" className='w-14 mb-1' />
                                        <div className='text-center'>
                                            <h1 className='text-lg font-semibold'>{item.quizName.charAt(0).toUpperCase() + item.quizName.slice(1)}</h1>
                                            <p>{t('quiz.comat')} {new Date(item.completedAt.seconds * 1000).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default Quiz