"use client";

import React, { useState } from 'react';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Turnstile from "react-turnstile";
import { server } from "@/app/config.json";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import { CheckIcon, ChevronsUpDownIcon, CircleCheckBig, LoaderCircle, Send } from 'lucide-react';
import axios from 'axios';

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
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';

function ResForm() {
    const [msg, setMSG] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const p = useTranslations('Province');

    // Define the formSchema inside the component to access the 't' function
    const formSchema = z.object({
        slevel: z.enum(["little", "normal", "spicy"], {
            required_error: "กรุณาเลือกระดับความเผ็ด",
        }),
        title: z.string().min(3, {
            message: "ชื่ออย่างน้อย 3 ตัวอักษร",
        }),
        decs: z
            .string()
            .min(5, {
                message: 'คำอธิบายอย่างน้อย 5 ตัวอักษร',
            })
            .max(80, {
                message: 'คำอธิบายไม่เกิน 80 ตัวอักษร',
            }),
        tel: z.string().min(10, {
            message: "กรุณาระบุเบอร์โทร",
        }),
        openhour: z.string().min(4, {
            message: "กรุณาระบุช่วงเวลาที่เปิด",
        }),
        province: z.string().min(1, {
            message: "กรุณาระบุจังหวัด",
        }),
        gmaps: z.string().min(24, {
            message: 'กรุณาใส่ลิงค์ Google Maps ที่ถูกต้อง',
        }),
        cfturn: z.string({
            required_error: 'กรุณาดำเนินการยืนยันให้เสร็จสิ้น',
        }).min(1, { message: 'กรุณาดำเนินการยืนยันให้เสร็จสิ้น' }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            decs: "",
            gmaps: "",
            openhour: "",
            tel: "",
            province: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const res = await axios.post(`https://${server}/request/restaurant`, values);
        if (res.data) {
            setMSG(1);
            setLoading(false);
        }
    }

    if (msg == 1) {
        return (
            <>
                <div className='mt-6 mb-4 w-full flex flex-col items-center justify-center bg-[#f7740a] text-white p-4 py-8 rounded-xl'>
                    <CircleCheckBig className='w-10 h-10' />
                    <div className='mt-2 text-center'>
                        <h1 className='font-semibold text-2xl mb-1'>ขอบคุณที่ส่งข้อมูลร้านอาหารของคุณ!</h1>
                        <p className='max-w-2xl'>เรากำลังตรวจสอบข้อมูลร้านอาหารของคุณในขณะนี้ หากเราต้องการข้อมูลเพิ่มเติม เราจะติดต่อคุณทางเบอร์โทรศัพท์ที่ให้ไว้</p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className='mt-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ชื่อร้านอาหาร</FormLabel>
                                    <FormControl>
                                        <Input placeholder={'ชื่อร้านอาหารของคุณ'} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="decs"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{'คำอธิบายร้านอาหาร'}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={'ช่วยบอกข้อมูลเกี่ยวกับร้านของคุณให้เราฟังหน่อย'}
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slevel"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>ระดับความเผ็ดของอาหารโดยรวม</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex gap-6 items-center"
                                        >
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <RadioGroupItem value="little" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    เผ็ดน้อย
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <RadioGroupItem value="normal" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    เผ็ดปานกลาง
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <RadioGroupItem value="spicy" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    เผ็ดมาก
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="openhour"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ช่วงเวลาที่เปิด</FormLabel>
                                    <FormControl>
                                        <Input placeholder={'เช่น เปิดทุกวัน หรือ ปิดวันอังคาร หรือ เปิดจันทร์ พุธ ศุกร์'} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>เบอร์โทรศัพท์</FormLabel>
                                    <FormControl>
                                        <Input type='number' placeholder={'0123456789'} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex flex-col md:flex-row md:items-start gap-3'>
                            <FormField
                                control={form.control}
                                name="province"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>จังหวัด</FormLabel>
                                        <FormControl className='w-full'>
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="md:w-[200px] justify-between w-full"
                                                    >
                                                        {field.value
                                                            ? Proworks.find((framework) => framework.value === field.value)?.label
                                                            : 'เลือกจังหวัด'}
                                                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="ค้นหาจังหวัดของคุณ" />
                                                        <CommandList>
                                                            <CommandEmpty>ไม่พบจังหวัดที่คุณค้นหา</CommandEmpty>
                                                            <CommandGroup>
                                                                {Proworks.map((framework) => (
                                                                    <CommandItem
                                                                        key={framework.value}
                                                                        value={framework.value}
                                                                        onSelect={(currentValue) => {
                                                                            const newValue = currentValue === field.value ? "" : currentValue;
                                                                            field.onChange(newValue);
                                                                            setOpen(false);
                                                                        }}
                                                                    >
                                                                        <CheckIcon
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                field.value === framework.value ? "opacity-100" : "opacity-0"
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
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gmaps"
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>ลิงค์ Google Maps</FormLabel>
                                        <FormControl>
                                            <Input placeholder={'กรุณาใส่ลิงค์ของคุณ'} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="cfturn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ยืนยันตัวตน</FormLabel>
                                    <FormControl>
                                        <Turnstile
                                            sitekey="0x4AAAAAABiWcS67qCPLgJew"
                                            theme='light'
                                            language={'th'}
                                            onVerify={(token) => {
                                                field.onChange(token)
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        กรุณายืนยันว่าคุณเป็นมนุษย์เพื่อช่วยเราป้องกันสแปม
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='w-full flex items-center justify-center'>
                            <Button disabled type="submit" className='w-full md:w-fit cursor-pointer bg-[#f7740a] text-white flex items-center gap-3 hover:bg-[#f7740a]'>{loading ? <LoaderCircle className='animate-spin' /> : <Send />} ส่งคำขอ</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default ResForm