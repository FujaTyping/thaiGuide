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
import { Checkbox } from "@/components/ui/checkbox";
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

function NewForm() {
    const t = useTranslations('Dashboard.item.qrcode.create');

    const formSchema = z.object({
        name: z.string().min(5, t('schemaerr.name')),
        lat: z.string().min(1, t('schemaerr.lat')),
        lng: z.string().min(1, t('schemaerr.lng')),
        points: z.string().min(1, t('schemaerr.points')),
        province: z.string().min(3, t('schemaerr.province')),
        onetime: z.optional(z.boolean()),
        captcha: z.string().min(1, t('schemaerr.cap'))
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            lat: "",
            lng: "",
            points: "",
            province: "",
            captcha: ""
        },
    })

    const turnstile = useTurnstile();
    const [open, setOpen] = useState(false);
    const p = useTranslations('Province');
    const [loading, setLoading] = useState(false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const payload = {
                name: values.name,
                location: {
                    lat: parseFloat(values.lat),
                    lng: parseFloat(values.lng)
                },
                points: parseInt(values.points),
                province: values.province,
            } as any
            if (values.onetime) payload.onetime = values.onetime
            const res: { data: { id: string } } = await axios.post(`${server}/edit/code/new`, payload, {
                headers: {
                    Authorization: `Bearer ${getCookie('guide_key')}`
                }
            })
            toast.success(t('toast.succ'), {
                description: `${t('toast.decss')} ${res.data.id}`
            });
            setLoading(false);
            turnstile.reset();
        } catch {
            toast.error(t('toast.err'), {
                description: t('toast.decse')
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
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('name')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('nph')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="points"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('reward')}</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder={t('rwph')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                                                    <CommandInput placeholder={t('spro')} />
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
                                            <Input type='number' placeholder={t('lph')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lng"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('lng')}</FormLabel>
                                        <FormControl>
                                            <Input type='number' placeholder={t('laph')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="captcha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('captcha')}</FormLabel>
                                    <FormControl>
                                        <Turnstile
                                            sitekey="0x4AAAAAABiWcS67qCPLgJew"
                                            theme='light'
                                            onVerify={(token) => {
                                                field.onChange(token)
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>{t('capph')}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center justify-center flex-col-reverse gap-4 mt-8 md:mt-0'>
                            <Button type="submit" className='bg-primary hover:bg-primary cursor-pointer w-full md:w-fit'>{loading ? <LoaderCircleIcon className='animate-spin' /> : <Send />}{t('submit')}</Button>
                            <FormField
                                control={form.control}
                                name="onetime"
                                render={({ field }) => (
                                    <FormItem className='flex items-center gap-2'>
                                        <FormControl>
                                            <Checkbox className='cursor-pointer' onCheckedChange={(e) => field.onChange(e)} />
                                        </FormControl>
                                        <FormLabel className='mb-1 cursor-pointer'>{t('sguqr')}</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
            </main>
        </>
    )
}

export default NewForm