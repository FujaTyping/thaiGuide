/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { Coins, LoaderCircle, MapPin, ScanLine } from 'lucide-react';
import React, { useState } from 'react'; import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import BarcodeScanner from "react-qr-barcode-scanner";
import Loader from '../components/loader';
import axios from "axios";

import NF from "@/assets/media/card/icon/notfound.png";
import LC from "@/assets/media/card/icon/locationcorrect.png";
interface ApiCodeData {
    name: string;
    points: number;
}

function Qr() {
    const [data, setData] = useState("");
    const [codeData, setCodeData] = useState<ApiCodeData | "error" | "">("");

    async function checkCode(code: string) {
        try {
            const response = await axios.put<ApiCodeData>("https://backend.thaiguide.siraphop.me/code/getbyid", {
                id: code
            });
            setCodeData(response.data);
        } catch (error) {
            console.error("Error checking code:", error);
            setCodeData("error");
        }
    }

    return (
        <>
            <div className='fixed bottom-0 right-0 p-4'>
                <Dialog>
                    <DialogTrigger onClick={() => { setData(""); setCodeData(""); }}><div className='bg-[#f7740a] cursor-pointer text-white p-3 rounded-full hover:bg-white hover:text-[#f7740a] border-2 border-[#f7740a] transition-all duration-250'>
                        <ScanLine className='size-8' />
                    </div></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className='text-2xl'>Scan to recive points</DialogTitle>
                            <p className='mb-4'>Position the QR code within the frame to scan it and receive your points.</p>
                            {
                                data == "" ? <>
                                    <div className='rounded-2xl'>
                                        <BarcodeScanner
                                            width={500}
                                            height={400}
                                            onUpdate={(err, result: any) => {
                                                if (result) {
                                                    setData(result.text);
                                                    checkCode(result.text);
                                                } else {
                                                    setData("")
                                                };
                                            }}
                                        />
                                        <p>{data}</p>
                                    </div>
                                    <p className='flex items-center justify-center mt-2 text-[#f7740a] font-semibold'>{data == "" ? <span className='flex items-center gap-2'><LoaderCircle className='animate-spin' />  Waiting for code</span> : <span className='text-center'>{data}</span>}</p>
                                </> :
                                    <>
                                        {
                                            codeData == "" ?
                                                <>
                                                    <div className='w-full flex items-center justify-center my-8'>
                                                        <Loader />
                                                    </div>
                                                </> :
                                                <>
                                                    {
                                                        codeData === "error" ? <>
                                                            <div className='flex items-center flex-col justify-center gap-4'>
                                                                <img src={NF.src} alt="Icon" className='w-32 translate-x-3' />
                                                                <p className='font-semibold'>Look like it not a valid QR-Code</p>
                                                            </div>
                                                        </> : <>
                                                            <div className='flex items-center flex-col justify-center gap-4'>
                                                                <img src={LC.src} alt="Location Correct Icon" className='w-32 translate-x-3' />
                                                                <div className='font-semibold'>
                                                                    <p className='flex items-center gap-2'><MapPin /> {codeData.name}</p>
                                                                    <p className='flex items-center gap-2 text-[#f7740a] mt-1'><Coins /> Points earn : +{codeData.points}</p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                        }
                                    </>
                            }
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}

export default Qr