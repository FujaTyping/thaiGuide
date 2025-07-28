import React from 'react';
import ResForm from './form';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ThaiGuide – เพิ่มร้านอาหารของคุณ"
};

function page() {
  return (
    <>
      <main className='max-w-7xl mx-auto px-4 py-6'>
        <div>
          <h1 className='font-bold text-4xl'>เพิ่มร้านอาหารของคุณ</h1>
          <div className='w-32 h-1.5 bg-[#f7740a] mt-2'></div>
          <p className='mt-4'>สนับสนุนธุรกิจในท้องถิ่นโดยการเพิ่มร้านอาหารของคุณลงในแพลตฟอร์มของเราได้ฟรี</p>
        </div>
        <ResForm />
      </main>
    </>
  )
}

export default page