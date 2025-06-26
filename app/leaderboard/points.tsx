"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from "@/app/config.json";
import Loader from '../components/loader';
import R1 from "@/assets/media/icon/Rank1.png";
import R2 from "@/assets/media/icon/Rank2.png";
import R3 from "@/assets/media/icon/Rank3.png";

interface dataTypes {
    name: string;
    point: number;
}

function Points() {
    const [data, setData] = useState<dataTypes[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://${server}/leaderboard/getbypoints`);
                setData(response.data);
            } catch (err) {
                console.error("Error fetching :", err);
                setData([]);
            }
        };
        fetchData();
    }, []);

    if (data.length === 0) return (
        <div className='w-full flex items-center justify-center my-12'>
            <Loader />
        </div>
    )

    return (
        <>
            <div className='flex flex-col gap-3 mt-2'>
                {
                    data.map((item, index) => (
                        <div key={index} className={`flex items-center place-content-between ${index < 3 ? "bg-[#f7740a] text-white" : ""}   rounded-md p-3 text-lg`}>
                            <div className='flex items-center gap-2 font-semibold'>
                                {
                                    index < 3 ? <>
                                        {index === 0 && <img src={R1.src} alt="Rank 1" className='w-8' />}
                                        {index === 1 && <img src={R2.src} alt="Rank 2" className='w-8' />}
                                        {index === 2 && <img src={R3.src} alt="Rank 3" className='w-8' />}
                                    </> : <>
                                        <p>#{index + 1}</p>
                                    </>
                                }
                                <p>{item.name}</p>
                            </div>
                            <p>{item.point} Points</p>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Points