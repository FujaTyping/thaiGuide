"use client";

import Loader from '@/app/components/loader';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from "@/app/config.json";
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import NF from "@/assets/media/card/icon/notfound.svg";
import DeleteModal from './deleteModal';

interface dataType {
    id: string
    url: string
    slogan: string
    fileid: string
}

interface deleteMD {
    id: string
    fileid: string
}

function Content() {
    const [data, setData] = useState<dataType[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [payload, setPayload] = useState<deleteMD>({
        id: '',
        fileid: ''
    });
    const [open, setOpen] = useState(false);
    const [MCC, setMCC] = useState('');

    useEffect(() => {
        async function getData() {
            setLoading(true);
            const datt = await axios.get(`${server}/edit/badge/getall`)
            setData(datt.data);
            setLoading(false);
        }
        getData();
    }, [])

    const filteredData = data.filter(item =>
        item.id.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        );
    }

    return (
        <>
            <section>
                <div className='pb-5 pt-2 flex items-center place-content-between gap-3'>
                    <Input
                        type="text"
                        placeholder='Filter by name'
                        className="max-w-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)} />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={'/dashboard/manage/badge/add'}>
                                <Button className="bg-primary hover:bg-primary cursor-pointer"><Plus /></Button>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add new badge</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                {
                    filteredData.length > 0 ? <>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                            {
                                filteredData.map((item, index) => (
                                    <div key={index} className='grid grid-cols-3 gap-6 border-3 border-primary rounded-xl p-3 px-4'>
                                        <div className='flex items-center justify-center gap-1 flex-col'>
                                            <img src={item.url} alt="Icon" className='w-32' />
                                            <h1 className='font-semibold text-base md:text-lg'>{item.id.charAt(0).toUpperCase() + item.id.slice(1)}</h1>
                                        </div>
                                        <div className='flex flex-col items-center justify-center gap-1 col-span-2'>
                                            <p className='text-base'>{item.slogan}</p>
                                            <div className='w-full flex items-end justify-end mt-1'>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Trash2
                                                            onClick={() => {
                                                                setPayload({
                                                                    id: item.id,
                                                                    fileid: item.fileid
                                                                });
                                                                setMCC('');
                                                                setOpen(true);
                                                            }}
                                                            size={18} className="text-primary cursor-pointer" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Delete this badge</p>
                                                    </TooltipContent>
                                                </Tooltip >
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </> : <>
                        <div className='flex items-center py-8 md:py-3 flex-col justify-center gap-4'>
                            <motion.div
                                animate={{
                                    x: [0, -10, 10, -10, 10, -5, 5, 0],
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut"
                                }}
                            >
                                <img src={NF.src} alt="Not Found" className='w-32 translate-x-3' />
                            </motion.div>
                            <p className='font-semibold'>No data</p>
                        </div>
                    </>
                }
            </section>
            <DeleteModal open={open} setOpen={setOpen} payload={payload} MCC={MCC} setMCC={setMCC} />
        </>
    )
}

export default Content