import React from 'react';
import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Checkin from './checkin';
import Points from './points';

export const metadata: Metadata = {
    title: "ThaiGuide – Leaderboard"
};

function page() {
    return (
        <>
            <main className='max-w-7xl mx-auto px-4 py-6'>
                <div>
                    <h1 className='font-bold text-4xl flex items-center gap-4'>Leaderboard</h1>
                    <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
                </div>
                <p className='mt-3'>See how you stack up against other explorers! The ThaiGuide Leaderboard ranks users based on points earned from visiting and checking in at various destinations. Climb the ranks, earn bragging rights, and see who is the ultimate ThaiGuide explorer. Keep exploring to reach the top!</p>
                <Tabs defaultValue="pt" className="w-full mt-4">
                    <TabsList className='w-full'>
                        <TabsTrigger value="pt" className='cursor-pointer'>Most Points</TabsTrigger>
                        <TabsTrigger value="cn" className='cursor-pointer'>Most Check-In</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pt"><Points /></TabsContent>
                    <TabsContent value="cn"><Checkin /></TabsContent>
                </Tabs>
            </main>
        </>
    )
}

export default page