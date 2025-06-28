"use client";

import React, { useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from 'next-intl';

const Proworks = [
    { value: "amnat charoen", label: "Amnat Charoen" },
    { value: "ang thong", label: "Ang Thong" },
    { value: "bangkok", label: "Bangkok" },
    { value: "bueng kan", label: "Bueng Kan" },
    { value: "buriram", label: "Buriram" },
    { value: "chachoengsao", label: "Chachoengsao" },
    { value: "chai nat", label: "Chai Nat" },
    { value: "chaiyaphum", label: "Chaiyaphum" },
    { value: "chanthaburi", label: "Chanthaburi" },
    { value: "chiang mai", label: "Chiang Mai" },
    { value: "chiang rai", label: "Chiang Rai" },
    { value: "chonburi", label: "Chonburi" },
    { value: "chumphon", label: "Chumphon" },
    { value: "kalasin", label: "Kalasin" },
    { value: "kamphaeng phet", label: "Kamphaeng Phet" },
    { value: "kanchanaburi", label: "Kanchanaburi" },
    { value: "khon kaen", label: "Khon Kaen" },
    { value: "krabi", label: "Krabi" },
    { value: "lampang", label: "Lampang" },
    { value: "lamphun", label: "Lamphun" },
    { value: "loei", label: "Loei" },
    { value: "lopburi", label: "Lopburi" },
    { value: "mae hong son", label: "Mae Hong Son" },
    { value: "maha sarakham", label: "Maha Sarakham" },
    { value: "mukdahan", label: "Mukdahan" },
    { value: "nakhon nayok", label: "Nakhon Nayok" },
    { value: "nakhon pathom", label: "Nakhon Pathom" },
    { value: "nakhon phanom", label: "Nakhon Phanom" },
    { value: "nakhon ratchasima", label: "Nakhon Ratchasima" },
    { value: "nakhon sawan", label: "Nakhon Sawan" },
    { value: "nakhon si thammarat", label: "Nakhon Si Thammarat" },
    { value: "nan", label: "Nan" },
    { value: "narathiwat", label: "Narathiwat" },
    { value: "nong bua lamphu", label: "Nong Bua Lamphu" },
    { value: "nong khai", label: "Nong Khai" },
    { value: "nonthaburi", label: "Nonthaburi" },
    { value: "pathum thani", label: "Pathum Thani" },
    { value: "pattani", label: "Pattani" },
    { value: "phang nga", label: "Phang Nga" },
    { value: "phatthalung", label: "Phatthalung" },
    { value: "phayao", label: "Phayao" },
    { value: "phetchabun", label: "Phetchabun" },
    { value: "phetchaburi", label: "Phetchaburi" },
    { value: "phichit", label: "Phichit" },
    { value: "phitsanulok", label: "Phitsanulok" },
    { value: "phra nakhon si ayutthaya", label: "Phra Nakhon Si Ayutthaya" },
    { value: "phrae", label: "Phrae" },
    { value: "phuket", label: "Phuket" },
    { value: "prachinburi", label: "Prachinburi" },
    { value: "prachuap khiri khan", label: "Prachuap Khiri Khan" },
    { value: "ranong", label: "Ranong" },
    { value: "ratchaburi", label: "Ratchaburi" },
    { value: "rayong", label: "Rayong" },
    { value: "roi et", label: "Roi Et" },
    { value: "sa kaeo", label: "Sa Kaeo" },
    { value: "sakon nakhon", label: "Sakon Nakhon" },
    { value: "samut prakan", label: "Samut Prakan" },
    { value: "samut sakhon", label: "Samut Sakhon" },
    { value: "samut songkhram", label: "Samut Songkhram" },
    { value: "saraburi", label: "Saraburi" },
    { value: "satun", label: "Satun" },
    { value: "songkhla", label: "Songkhla" },
    { value: "sing buri", label: "Sing Buri" },
    { value: "sisaket", label: "Sisaket" },
    { value: "sukhothai", label: "Sukhothai" },
    { value: "suphan buri", label: "Suphan Buri" },
    { value: "surat thani", label: "Surat Thani" },
    { value: "surin", label: "Surin" },
    { value: "tak", label: "Tak" },
    { value: "trang", label: "Trang" },
    { value: "trat", label: "Trat" },
    { value: "ubon ratchathani", label: "Ubon Ratchathani" },
    { value: "udon thani", label: "Udon Thani" },
    { value: "uthai thani", label: "Uthai Thani" },
    { value: "uttaradit", label: "Uttaradit" },
    { value: "yala", label: "Yala" },
    { value: "yasothon", label: "Yasothon" },
]

function Embed() {
    const t = useTranslations('WeaATem');
    const p = useTranslations('Province');
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("songkhla")

    const iframeSrc = `https://www.tmd.go.th/en/weatherForecast7DaysWidget?province=${value}`;
    return (
        <>
            <div className='mb-4 flex flex-col md:flex-row place-content-between md:items-center gap-3'>
                <div className='flex items-center gap-3'>
                    <h1>{t('selecttext')} : </h1>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] justify-between"
                            >
                                {value
                                    ? Proworks.find((framework) => framework.value === value)?.label
                                    : `${t('select.start')}`}
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder={t('select.search')} />
                                <CommandList>
                                    <CommandEmpty>{t('select.notfound')}</CommandEmpty>
                                    <CommandGroup>
                                        {Proworks.map((framework) => (
                                            <CommandItem
                                                key={framework.value}
                                                value={framework.value}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? "" : currentValue)
                                                    setOpen(false)
                                                }}
                                            >
                                                <CheckIcon
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === framework.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {p(`${framework.value}`)}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <iframe src={iframeSrc} height="400" className='w-full border-0 mt-2' scrolling="no" title={`Weather forecast for ${value}`}></iframe>
        </>
    )
}

export default Embed