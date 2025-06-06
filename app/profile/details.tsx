"use client";

import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Coins } from 'lucide-react';
import { User, onAuthStateChanged } from "firebase/auth";
import auth from "@/lib/firebaseAuth";
import Loader from '../components/loader';

const HistoryINV = [
    {
        id: "ID001",
        type: "Daily Check-In",
        place: "-",
        point: "+5"
    },
    {
        id: "ID002",
        type: "Scan QR",
        place: "Samila Beach",
        point: "+10"
    },
    {
        id: "ID003",
        type: "Daily Check-In",
        place: "-",
        point: "+5"
    }
]

function Details() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!user) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        )
    }

    return (
        <>
            <Table className='my-4'>
                <TableCaption>A list of your recent transactions.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Place</TableHead>
                        <TableHead className="text-right">Point Recieved</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        HistoryINV.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item.id}</TableCell>
                                <TableCell>{item.type}</TableCell>
                                <TableCell>{item.place}</TableCell>
                                <TableCell className="font-semibold text-[#f7740a] flex justify-end items-center gap-2"><Coins /> {item.point}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </>
    )
}

export default Details