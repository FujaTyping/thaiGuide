/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Turnstile, { useTurnstile } from 'react-turnstile';
import { CheckIcon, ChevronsUpDownIcon, LoaderCircleIcon, Send } from 'lucide-react';
import Proworks from '@/data/province';
import axios from 'axios';
import { server } from "@/app/config.json";

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
import { toast } from 'sonner';
import { getCookie } from 'cookies-next/client';
import { useTheme } from 'next-themes';
import { Textarea } from '@/components/ui/textarea';

function NewForm() {
    const t = useTranslations('Dashboard.item.activities.add.form');

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const formSchema = z.object({
        title: z.string().min(5, t('zod.title')),
        lat: z.string().min(1, t('zod.lat')),
        lon: z.string().min(1, t('zod.lon')),
        decs: z.string().min(20, t('zod.decs')),
        province: z.string().min(3, t('zod.decs')),
        direction: z.string().url(t('zod.direction')),
        location: z.string().min(8, t('zod.location')),
        ndtitle: z.string().min(3, t('zod.ndtitle')),
        rating: z.string().min(1, t('zod.rating')),
        captcha: z.string().min(1, t('zod.captcha')),
        thumnails: z
            .instanceof(File, { message: t('zod.file.msg') })
            .refine((file) => file.size <= MAX_FILE_SIZE, t('zod.file.max'))
            .refine(
                (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
                t('zod.file.type')
            ),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            lat: "",
            lon: "",
            decs: "",
            province: "",
            captcha: "",
            direction: "",
            location: "",
            ndtitle: "",
            rating: "",
        },
    })

    const turnstile = useTurnstile();
    const [open, setOpen] = useState(false);
    const p = useTranslations('Province');
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme() as any;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const res: { data: { id: string } } = await axios.post(`${server}/edit/activities/add`, {
                ...values
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${getCookie('guide_key')}`
                }
            })
            toast.success(t('toast.succ'), {
                description: `${t('toast.dsucc')} ${res.data}`
            });
            setLoading(false);
            turnstile.reset();
        } catch {
            toast.error(t('toast.err'), {
                description: t('toast.derr')
            })
            setLoading(false);
            turnstile.reset();
        }

    }

    return (
        <>
            <main className='max-w-7xl mx-auto px-4 pb-6'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('title')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('placeholder.title')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ndtitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('head')}</FormLabel>
                                        <FormControl>
                                            <Input type='text' placeholder={t('placeholder.head')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="decs"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('decs')}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t('placeholder.decs')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="thumnails"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('thumb')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            accept="image/*"
                                            type="file"
                                            onChange={(e) => field.onChange(e.target.files?.[0])}
                                            onBlur={field.onBlur}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t('dthumb')}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="province"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('province')}</FormLabel>
                                    <FormControl className='w-full'>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="justify-between w-full"
                                                >
                                                    {field.value
                                                        ? Proworks.find((framework) => framework.value === field.value)?.label
                                                        : t('slpro')}
                                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder={t('slpro')} />
                                                    <CommandList>
                                                        <CommandEmpty>{t('nopro')}</CommandEmpty>
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
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
                            <FormField
                                control={form.control}
                                name="lat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('lat')}</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder={t('placeholder.lat')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('lon')}</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder={t('placeholder.lon')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('location')}</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder={t('placeholder.location')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="direction"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('direction')}</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder={t('placeholder.direction')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('rating')}</FormLabel>
                                    <FormControl>
                                        <Input type='number' placeholder={t('placeholder.rating')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="captcha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('captcha')}</FormLabel>
                                    <FormControl>
                                        <Turnstile
                                            sitekey="0x4AAAAAABiWcS67qCPLgJew"
                                            theme={theme}
                                            onVerify={(token) => {
                                                field.onChange(token)
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>{t('dcaptcha')}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center justify-center flex-col-reverse gap-4 mt-8 md:mt-0'>
                            <Button type="submit" className='bg-primary hover:bg-primary cursor-pointer w-full md:w-fit'>{loading ? <LoaderCircleIcon className='animate-spin' /> : <Send />}{t('submit')}</Button>
                        </div>
                    </form>
                </Form>
            </main>
        </>
    )
}

export default NewForm