/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { LoaderCircle, ScanLine } from 'lucide-react';
import React, { useState } from 'react'; import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import BarcodeScanner from "react-qr-barcode-scanner";
import Loader from '../components/loader';

function Qr() {
    const [data, setData] = useState("");

    return (
        <>
            <div className='fixed bottom-0 right-0 p-4'>
                <Dialog>
                    <DialogTrigger onClick={() => setData("")}><div className='bg-[#f7740a] cursor-pointer text-white p-3 rounded-full hover:bg-white hover:text-[#f7740a] border-2 border-[#f7740a] transition-all duration-250'>
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
                                                if (result) setData(result.text);
                                                else setData("");
                                            }}
                                        />
                                        <p>{data}</p>
                                    </div>
                                </> :
                                    <>
                                        <div className='w-full flex items-center justify-center my-8'>
                                            <Loader />
                                        </div>
                                    </>
                            }
                            <p className='flex items-center justify-center mt-2 text-[#f7740a] font-semibold'>{data == "" ? <span className='flex items-center gap-2'><LoaderCircle className='animate-spin' />  Waiting for code</span> : <span className='text-center'>{data}</span>}</p>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}

export default Qr