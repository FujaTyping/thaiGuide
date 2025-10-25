"use client";

import React, { useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Turnstile from "react-turnstile";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import { CircleCheckBig, LoaderCircle, Send } from 'lucide-react';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { toast } from "sonner";
import { server } from "@/app/config.json"

function IssuesForm() {
    const t = useTranslations('Feedback');
    const [msg, setMSG] = useState(0);
    const [loading, setLoading] = useState(false);
    const el = useTranslations('NavBar');

    // Define the formSchema inside the component to access the 't' function
    const formSchema = z.object({
        type: z.enum(["issues", "feedback"], {
            required_error: t('form.type.required_error'),
        }),
        title: z.string().min(3, {
            message: t('form.title.min_length'),
        }),
        decs: z
            .string()
            .min(5, {
                message: t('form.message.min_length'),
            })
            .max(80, {
                message: t('form.message.max_length'),
            }),
        experience: z.enum(["1", "2", "3", "4", "5"], {
            required_error: t('form.exp.required_error'),
        }),
        cfturn: z.string({
            required_error: t('form.verify.required_error'),
        }).min(1, { message: t('form.verify.min_length') }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            decs: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            if (values.type == "feedback") {
                await axios.post(`https://${server}/feedback`, {
                    type: values.type,
                    title: values.title,
                    decs: values.decs,
                    experience: parseInt(values.experience),
                    cfturn: values.cfturn
                });
                setMSG(1);
            } else {
                await axios.post("https://n8n.siraphop.me/webhook/e8da7725-df6b-4f2c-8e24-389958ffdc26", values);
                setMSG(1);
            }
        } catch (error) {
            setLoading(false);
            toast.error(`${el('login.e')}: ${error}`);
        } finally {
            setLoading(false);
        }
    }

    if (msg == 1) {
        return (
            <>
                <div className='mt-6 mb-4 w-full flex flex-col items-center justify-center bg-[#f7740a] text-white p-4 py-8 rounded-xl'>
                    <CircleCheckBig className='w-10 h-10' />
                    <div className='mt-2 text-center'>
                        <h1 className='font-semibold text-2xl mb-1'>{t('pptk')}</h1>
                        <p className='max-w-2xl'>{t('pptkdecs')}</p>
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
                            name="type"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>{t('form.type.title')}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex gap-6 items-center"
                                        >
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <RadioGroupItem value="issues" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {t('form.type.c1')}
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <RadioGroupItem value="feedback" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {t('form.type.c2')}
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
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.title.title')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={`${t('form.title.placeholder')}`} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {t('form.title.decs')}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="decs"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.message.title')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={`${t('form.message.placeholder')}`}
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t('form.message.decs')}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>{t('form.exp.title')}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-2 md:flex gap-6 items-center"
                                        >
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <RadioGroupItem value="1" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {t('form.exp.1')}
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <RadioGroupItem value="2" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {t('form.exp.2')}
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <RadioGroupItem value="3" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {t('form.exp.3')}
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <RadioGroupItem value="4" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {t('form.exp.4')}
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-3">
                                                <FormControl>
                                                    <RadioGroupItem value="5" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {t('form.exp.5')}
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
                            name="cfturn"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.verify.title')}</FormLabel>
                                    <FormControl>
                                        <Turnstile
                                            sitekey="0x4AAAAAABiWcS67qCPLgJew"
                                            theme='light'
                                            onVerify={(token) => {
                                                field.onChange(token)
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {t('form.verify.decs')}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='w-full flex items-center justify-center'>
                            <Button type="submit" className='w-full md:w-fit cursor-pointer bg-[#f7740a] text-white flex items-center gap-3 hover:bg-[#f7740a]'>{loading ? <LoaderCircle className='animate-spin' /> : <Send />} Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default IssuesForm