"use client";

import React, { useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { useTranslations } from 'next-intl';
import { Textarea } from '@/components/ui/textarea';
import Turnstile, { useTurnstile } from 'react-turnstile';
import { LoaderCircleIcon, Send } from 'lucide-react';
import axios from 'axios';
import { server } from "@/app/config.json";
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCookie } from 'cookies-next/client';

function FForm() {
    const [loading, setLoading] = useState(false);
    const turnstile = useTurnstile();
    const t = useTranslations('Dashboard.item.reward.form');

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    enum typeS {
        background = "background"
    }

    const formSchema = z.object({
        by: z.string().min(3, t('validate.by')),
        decs: z.string().min(20, t('validate.decs')),
        image: z
            .instanceof(File, { message: t('validate.file') })
            .refine((file) => file.size <= MAX_FILE_SIZE, t('validate.fileMax'))
            .refine(
                (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
                "Only .jpg, .jpeg, .png and .webp formats are supported."
            ),
        name: z.string().min(5, t('validate.name')),
        quantity: z.string().min(1, t('validate.quantity')),
        require: z.string().min(1, t('validate.require')),
        attach: z.optional(z.string().min(5, t('validate.attach'))),
        type: z.optional(z.nativeEnum(typeS, { errorMap: () => ({ message: t('validate.type') }) })),
        virtual: z.optional(z.boolean()),
        captcha: z.string().min(1, t('validate.captcha'))
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            by: "",
            decs: "",
            name: "",
            quantity: "",
            require: "",
            captcha: ""
        },
    })

    const isVirtual = form.watch('virtual');

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            await axios.post(`${server}/edit/redeem/newitem`, values, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${getCookie('guide_key')}`
                }
            });
            toast.success(t('toast.succ'), {
                description: t('toast.dsucc')
            });
            turnstile.reset();
            setLoading(false);
        } catch {
            toast.error(t('toast.err'), {
                description: t('toast.derr')
            })
            turnstile.reset();
            setLoading(false);
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('field.name')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            {...field}
                                            placeholder={t('field.pname')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="by"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('field.by')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            {...field}
                                            placeholder={t('field.pby')}
                                        />
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
                                <FormLabel>{t('field.decs')}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder={t('field.pdecs')}
                                    />
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
                                <FormLabel>{t('field.image')}</FormLabel>
                                <FormControl>
                                    <Input
                                        accept="image/*"
                                        type="file"
                                        onChange={(e) => field.onChange(e.target.files?.[0])}
                                        onBlur={field.onBlur}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t('field.dimage')}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-2 gap-4 items-start'>
                        <FormField
                            control={form.control}
                            name="require"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('field.require')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            placeholder={t('field.prequire')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('field.quantity')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            placeholder={t('field.pquantity')}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {isVirtual && (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name="attach"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('field.attach')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder={t('field.pattach')}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('field.type')}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={t('field.ptype')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(typeS).map((type) => (<SelectItem key={type} value={type}>{`${t(`field.selectType.${type}`)}`}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        </div>
                    )}
                    <FormField
                        control={form.control}
                        name="captcha"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('field.captcha')}</FormLabel>
                                <FormControl>
                                    <Turnstile
                                        sitekey="0x4AAAAAABiWcS67qCPLgJew"
                                        theme='light'
                                        onVerify={(token) => {
                                            field.onChange(token)
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>{t('field.dcaptcha')}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex items-center justify-center flex-col-reverse gap-4 mt-8 md:mt-0'>
                        <Button type="submit" className='bg-primary hover:bg-primary cursor-pointer w-full md:w-fit'>{loading ? <LoaderCircleIcon className='animate-spin' /> : <Send />}{t('field.submitBTN')}</Button>
                        <FormField
                            control={form.control}
                            name="virtual"
                            render={({ field }) => (
                                <FormItem className='flex items-center gap-2'>
                                    <FormControl>
                                        <Checkbox className='cursor-pointer' onCheckedChange={field.onChange} checked={field.value} />
                                    </FormControl>
                                    <FormLabel className='mb-1 cursor-pointer'>{t('field.isVirtual')}</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </>
    )
}

export default FForm