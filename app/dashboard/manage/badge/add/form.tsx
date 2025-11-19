"use client";

import React, { useState } from 'react';
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Proworks from '@/data/province';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckIcon, ChevronsUpDownIcon, LoaderCircleIcon, Send } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from "@/lib/utils";
import { Textarea } from '@/components/ui/textarea';
import Turnstile, { useTurnstile } from 'react-turnstile';
import axios from 'axios';
import { server } from "@/app/config.json";
import { toast } from 'sonner';

function FForm() {
    const p = useTranslations('Province');
    const turnstile = useTurnstile();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const formSchema = z.object({
        image: z
            .instanceof(File, { message: "Please select an image" })
            .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
            .refine(
                (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
                "Only .jpg, .jpeg, .png and .webp formats are supported."
            ),
        name: z.string().min(3, 'Please select province'),
        slogan: z.string().min(10, 'Slogan must be at least 10 characters long'),
        captcha: z.string().min(1, 'Please complete the CAPTCHA verification')
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slogan: "",
            captcha: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            await axios.post(`${server}/edit/badge/new`, values, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Badge Created', {
                description: 'Your new badge has been added successfully'
            });
            turnstile.reset();
            setLoading(false);
        } catch {
            toast.error('Failed to Add Badge', {
                description: 'Something went wrong. Please check your inputs and try again'
            })
            turnstile.reset();
            setLoading(false);
        }
        console.log(values)
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Province</FormLabel>
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
                                                    : 'Select province'}
                                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder={'Search province'} />
                                                <CommandList>
                                                    <CommandEmpty>{'No province that you find'}</CommandEmpty>
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
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Badge Image</FormLabel>
                                <FormControl>
                                    <Input
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => field.onChange(e.target.files?.[0])}
                                        onBlur={field.onBlur}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Recommend dimension 512x512 px
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slogan"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slogan</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder='Slogan of province' />
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
                                <FormLabel>Captcha</FormLabel>
                                <FormControl>
                                    <Turnstile
                                        sitekey="0x4AAAAAABiWcS67qCPLgJew"
                                        theme='light'
                                        onVerify={(token) => {
                                            field.onChange(token)
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>Please verify you are human to help us prevent spam</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex items-center justify-center flex-col-reverse gap-4 mt-8 md:mt-0'>
                        <Button type="submit" className='bg-primary hover:bg-primary cursor-pointer w-full md:w-fit'>{loading ? <LoaderCircleIcon className='animate-spin' /> : <Send />}Submit</Button>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default FForm