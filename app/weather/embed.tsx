"use client";

import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const thaiProvinces = [
    "Amnat Charoen", "Ang Thong", "Bangkok", "Bueng Kan", "Buriram", "Chachoengsao",
    "Chai Nat", "Chaiyaphum", "Chanthaburi", "Chiang Mai", "Chiang Rai", "Chonburi",
    "Chumphon", "Kalasin", "Kamphaeng Phet", "Kanchanaburi", "Khon Kaen", "Krabi",
    "Lampang", "Lamphun", "Loei", "Lopburi", "Mae Hong Son", "Maha Sarakham",
    "Mukdahan", "Nakhon Nayok", "Nakhon Pathom", "Nakhon Phanom", "Nakhon Ratchasima",
    "Nakhon Sawan", "Nakhon Si Thammarat", "Nan", "Narathiwat", "Nong Bua Lamphu",
    "Nong Khai", "Nonthaburi", "Pathum Thani", "Pattani", "Phang Nga", "Phatthalung",
    "Phayao", "Phetchabun", "Phetchaburi", "Phichit", "Phitsanulok", "Phra Nakhon Si Ayutthaya",
    "Phrae", "Phuket", "Prachinburi", "Prachuap Khiri Khan", "Ranong", "Ratchaburi",
    "Rayong", "Roi Et", "Sa Kaeo", "Sakon Nakhon", "Samut Prakan", "Samut Sakhon",
    "Samut Songkhram", "Saraburi", "Satun", "Sing Buri", "Sisaket", "Songkhla",
    "Sukhothai", "Suphan Buri", "Surat Thani", "Surin", "Tak", "Trang", "Trat",
    "Ubon Ratchathani", "Udon Thani", "Uthai Thani", "Uttaradit", "Yala", "Yasothon"
];

const provinceUrlMap: { [key: string]: string } = {
    "Amnat Charoen": "Amnat Charoen",
    "Ang Thong": "Ang Thong",
    "Bangkok": "Bangkok",
    "Bueng Kan": "Bueng Kan",
    "Buriram": "Buri Ram",
    "Chachoengsao": "Chachoengsao",
    "Chai Nat": "Chai Nat",
    "Chaiyaphum": "Chaiyaphum",
    "Chanthaburi": "Chanthaburi",
    "Chiang Mai": "Chiang Mai",
    "Chiang Rai": "Chiang Rai",
    "Chonburi": "Chon Buri",
    "Chumphon": "Chumphon",
    "Kalasin": "Kalasin",
    "Kamphaeng Phet": "Kamphaeng Phet",
    "Kanchanaburi": "Kanchanaburi",
    "Khon Kaen": "Khon Kaen",
    "Krabi": "Krabi",
    "Lampang": "Lampang",
    "Lamphun": "Lamphun",
    "Loei": "Loei",
    "Lopburi": "Lop Buri",
    "Mae Hong Son": "Mae Hong Son",
    "Maha Sarakham": "Maha Sarakham",
    "Mukdahan": "Mukdahan",
    "Nakhon Nayok": "Nakhon Nayok",
    "Nakhon Pathom": "Nakhon Pathom",
    "Nakhon Phanom": "Nakhon Phanom",
    "Nakhon Ratchasima": "Nakhon Ratchasima",
    "Nakhon Sawan": "Nakhon Sawan",
    "Nakhon Si Thammarat": "Nakhon Si Thammarat",
    "Nan": "Nan",
    "Narathiwat": "Narathiwat",
    "Nong Bua Lamphu": "Nong Bua Lam Phu",
    "Nong Khai": "Nong Khai",
    "Nonthaburi": "Nonthaburi",
    "Pathum Thani": "Pathum Thani",
    "Pattani": "Pattani",
    "Phang Nga": "Phangnga",
    "Phatthalung": "Phatthalung",
    "Phayao": "Phayao",
    "Phetchabun": "Phetchabun",
    "Phetchaburi": "Phetchaburi",
    "Phichit": "Phichit",
    "Phitsanulok": "Phitsanulok",
    "Phra Nakhon Si Ayutthaya": "Phra Nakhon Si Ayutthaya",
    "Phrae": "Phrae",
    "Phuket": "Phuket",
    "Prachinburi": "Prachin Buri",
    "Prachuap Khiri Khan": "Prachuap Khiri Khan",
    "Ranong": "Ranong",
    "Ratchaburi": "Ratchaburi",
    "Rayong": "Rayong",
    "Roi Et": "Roi Et",
    "Sa Kaeo": "Sa Kaeo",
    "Sakon Nakhon": "Sakon Nakhon",
    "Samut Prakan": "Samut Prakan",
    "Samut Sakhon": "Samut Sakhon",
    "Samut Songkhram": "Samut Songkhram",
    "Saraburi": "Saraburi",
    "Satun": "Satun",
    "Sing Buri": "Sing Buri",
    "Sisaket": "Si Sa Ket",
    "Songkhla": "Songkhla",
    "Sukhothai": "Sukhothai",
    "Suphan Buri": "Suphan Buri",
    "Surat Thani": "Surat Thani",
    "Surin": "Surin",
    "Tak": "Tak",
    "Trang": "Trang",
    "Trat": "Trat",
    "Ubon Ratchathani": "Ubon Ratchathani",
    "Udon Thani": "Udon Thani",
    "Uthai Thani": "Uthai Thani",
    "Uttaradit": "Uttaradit",
    "Yala": "Yala",
    "Yasothon": "Yasothon"
};

const formatProvinceForUrl = (provinceName: string): string => {
    const mappedName = provinceUrlMap[provinceName] || provinceName;
    return encodeURIComponent(mappedName);
};

function Embed() {
    const [selectedProvince, setSelectedProvince] = useState<string>("Songkhla");
    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
    };

    const iframeSrc = `https://www.tmd.go.th/en/weatherForecast7DaysWidget?province=${formatProvinceForUrl(selectedProvince)}`;
    return (
        <>
            <div className='mb-6 flex flex-col md:flex-row place-content-between md:items-center gap-3'>
                <div className='flex items-center gap-3'>
                    <h1>Provience : </h1>
                    <Select onValueChange={handleProvinceChange} value={selectedProvince}>
                        <SelectTrigger className='w-62'>
                            <SelectValue placeholder="Select a Province" />
                        </SelectTrigger>
                        <SelectContent>
                            {thaiProvinces.map((province) => (
                                <SelectItem key={province} value={province}>
                                    {province}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='font-semibold'>
                    <p>Source : Thai Meteorological Department</p>
                </div>
            </div>
            <iframe src={iframeSrc} height="400" className='w-full border-0' scrolling="no" title={`Weather forecast for ${selectedProvince}`}></iframe>
        </>
    )
}

export default Embed