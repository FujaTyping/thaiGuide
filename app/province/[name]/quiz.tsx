"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, LibraryBig, TriangleAlert, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Loader from '@/app/components/loader';
import NF from "@/assets/media/card/icon/notfound.svg";
import { useTranslations } from 'next-intl';
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import { server } from "@/app/config.json";
import ConfettiExplosion from 'react-confetti-explosion';
import axios from 'axios';

interface QuizProps {
    data: string;
}

interface Choice {
    text: string;
    isCorrect: boolean;
}

interface Question {
    questionText: string;
    choices: Choice[];
}

interface QuizApiResponse {
    quizTitle: string;
    province: string;
    questions: Question[];
}

type QuizStatus = 'idle' | 'loading' | 'active' | 'finished' | 'error';

function Quiz({ data: provinceName }: QuizProps) {
    const [quizData, setQuizData] = useState<QuizApiResponse | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [status, setStatus] = useState<QuizStatus>('idle');
    const [selectedAnswerText, setSelectedAnswerText] = useState<string | null>(null);
    const t = useTranslations('EmQuiz');
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        setIsAuthLoading(true);
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setIsAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleStartQuiz = async () => {
        setStatus('loading');
        setQuizData(null);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswerText(null);

        try {
            const response = await fetch(`https://${server}/quiz/gen`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ province: provinceName.toLowerCase() }),
            });

            if (!response.ok) {
                let errorMsg = `${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorData.error || `Failed to fetch quiz: ${response.statusText}`;
                } catch {
                    const rawText = await response.text().catch(() => null);
                    errorMsg = rawText || errorMsg;
                }
                throw new Error(errorMsg);
            }

            const data: QuizApiResponse = await response.json();
            if (data && data.questions && data.questions.length > 0) {
                setQuizData(data);
                setStatus('active');
            } else {
                throw new Error('No questions found for this province. The quiz might be empty.');
            }
        } catch (error) {
            console.error("Error fetching quiz:", error);
            setStatus('error');
        }
    };

    const handleAnswerSelect = (choice: Choice) => {
        if (selectedAnswerText) return;

        setSelectedAnswerText(choice.text);
        if (choice.isCorrect) {
            setScore(prevScore => prevScore + 1);
        }
    };

    const handleNextQuestion = () => {
        setSelectedAnswerText(null);
        if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            setStatus('finished');
            if (user) {
                axios.put(`https://${server}/quiz/check`, {
                    userId: user.uid,
                    quizName: provinceName
                })
            }
        }
    };

    const handleRestartQuiz = () => {
        setStatus('idle');
        setQuizData(null);
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswerText(null);
    };

    const getMotionKey = () => {
        if (status === 'active' && quizData) {
            return `question-${currentQuestionIndex}`;
        }
        return status;
    };

    const motionAnimProps = {
        initial: { y: 10, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -10, opacity: 0 },
        transition: { duration: 0.2 },
    };


    const renderContent = () => {
        const key = getMotionKey();

        if (status === 'loading') {
            return (
                <motion.div key={key} {...motionAnimProps}>
                    <div className='flex items-center justify-center rounded-xl'>
                        <Loader />
                    </div>
                </motion.div>
            );
        }

        if (status === 'error') {
            return (
                <motion.div key={key} {...motionAnimProps}>
                    <motion.div
                        animate={{
                            x: [0, -10, 10, -10, 10, -5, 5, 0],
                        }}
                        transition={{
                            duration: 0.5,
                            ease: "easeInOut"
                        }}
                        className='flex items-center justify-center mb-3'
                    >
                        <img src={NF.src} alt="Icon" className='w-32 translate-x-3' />
                    </motion.div>
                    <p className='font-semibold text-2xl mb-2'>{t('error')}</p>
                    <button
                        onClick={handleStartQuiz}
                        className="text-black bg-white px-6 py-2 rounded-lg md:w-fit w-full cursor-pointer"
                    >
                        {t('errorbtn')}
                    </button>
                </motion.div>
            );
        }

        if (status === 'finished' && quizData) {
            return (
                <>
                    <div className='flex items-center justify-center flex-col'>
                        <ConfettiExplosion colors={['#ff577f', '#ff884b', '#ffd384', '#fff9b0']} zIndex={99} />
                        <motion.div key={key} {...motionAnimProps}>
                            <h2 className="md:text-3xl text-2xl font-bold mb-2">{t('finish')}</h2>
                            <p className="text-xl mb-3">
                                {t('score')} : {score} / {quizData.questions.length} {`(${((score / quizData.questions.length) * 100).toFixed(0)}%)`}
                            </p>
                            {!user && (
                                <div className='text-white flex items-center justify-center gap-2 mb-4'>
                                    <TriangleAlert />
                                    <p className='font-semibold'>{t('nolog')}</p>
                                </div>
                            )}
                            <button
                                onClick={handleRestartQuiz}
                                className="text-black bg-white px-4 py-2 rounded-lg md:w-fit w-full cursor-pointer"
                            >
                                {t('restartbtn')}
                            </button>
                        </motion.div>
                    </div>
                </>
            );
        }

        if (status === 'active' && quizData) {
            const currentQuestion = quizData.questions[currentQuestionIndex];
            return (
                <motion.div key={key} {...motionAnimProps}>
                    <h2 className="md:text-3xl text-2xl font-bold mb-2 text-center">{quizData.quizTitle}</h2>
                    <p className="mb-4 md:mb-6 text-center">
                        {t('q')} {currentQuestionIndex + 1} of {quizData.questions.length}
                    </p>
                    <div>
                        <p className="text-xl font-semibold mb-4">{currentQuestion.questionText}</p>
                        <div className="space-y-3">
                            {currentQuestion.choices.map((choice, index) => {
                                let buttonClass = "w-full text-left p-3 rounded-lg transition-colors duration-150 ease-in-out flex items-center justify-between ";
                                let icon = null;

                                if (selectedAnswerText) {
                                    const isThisChoiceSelected = choice.text === selectedAnswerText;
                                    const isThisChoiceCorrect = choice.isCorrect;

                                    if (isThisChoiceSelected) {
                                        if (isThisChoiceCorrect) {
                                            buttonClass += "bg-white text-black";
                                            icon = <CheckCircle className="h-5 w-5 text-primary" />;
                                        } else {
                                            buttonClass += "bg-gray-200 text-black";
                                            icon = <XCircle className="h-5 w-5 text-primary" />;
                                        }
                                    } else if (isThisChoiceCorrect) {
                                        buttonClass += "text-black bg-white cursor-not-allowed";
                                        icon = <CheckCircle className="h-5 w-5 text-primary" />;
                                    } else {
                                        buttonClass += "bg-gray-200 text-black cursor-not-allowed";
                                    }
                                } else {
                                    buttonClass += "bg-white text-black";
                                }
                                return (
                                    <button key={index} onClick={() => handleAnswerSelect(choice)} disabled={!!selectedAnswerText} className={`${buttonClass.trim()} cursor-pointer`}>
                                        <span>{choice.text}</span>
                                        {icon}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {selectedAnswerText && (
                        <div className="text-center mt-6">
                            <button onClick={handleNextQuestion} className="text-black bg-white rounded-lg px-4 py-2 md:w-fit w-full">
                                {currentQuestionIndex < quizData.questions.length - 1 ? t('next') : t('fquiz')}
                            </button>
                        </div>
                    )}
                </motion.div>
            );
        }
        return (
            <motion.div key={key} {...motionAnimProps}>
                <h1 className="md:text-3xl text-2xl font-bold mb-2">{t('title')}</h1>
                <p>
                    {t('decs')} {provinceName.charAt(0).toUpperCase() + provinceName.slice(1)}?
                </p>
                <button
                    onClick={handleStartQuiz}
                    className="bg-white text-black px-4 py-2 rounded-lg mt-4 md:w-fit w-full"
                >
                    {t('sbtn')}
                </button>
            </motion.div>
        );
    };

    if (isAuthLoading) {
        return (
            <div className='tg-container'>
                <div className='w-full bg-primary py-6 px-4 rounded-xl text-center'>
                    <div className='flex items-center justify-center rounded-xl'>
                        <Loader />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='tg-container'>
            <div className='w-full bg-primary py-6 px-4 rounded-xl text-center text-white'>
                <AnimatePresence>
                    {(status !== 'loading' && status !== 'error') && (
                        <motion.div
                            key="library-icon-container"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className='w-full items-center justify-center flex mb-3'
                        >
                            <LibraryBig className='size-8 md:size-10' />
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                    {renderContent()}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Quiz;