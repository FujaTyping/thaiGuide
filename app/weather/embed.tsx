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
import Proworks from '@/data/province';

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