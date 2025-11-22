"use client"

import { z } from "zod";
import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import axios from "axios";
import { server } from "@/app/config.json";
import { Textarea } from "@/components/ui/textarea";
import Turnstile, { useTurnstile } from "react-turnstile";
import { Eraser, LoaderCircleIcon, Send } from "lucide-react";
import Loader from "@/app/components/loader";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

function FFORM() {
    const t = useTranslations('Dashboard.item.alert')
    const turnstile = useTurnstile();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    enum selectType {
        Earthquake = "Earthquake",
        Flood = "Flood",
        Alert = "Alert",
        Extreme = "Extreme",
        Other = "Other"
    }

    const formSchema = z.object({
        message: z.string().min(20, t('form.err.msg')),
        reference: z.string().url(t('form.err.url')),
        type: z.nativeEnum(selectType),
        captcha: z.string().min(1, t('form.err.cap'))
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
            reference: "",
            type: selectType.Alert,
            captcha: ""
        },
    })

    useEffect(() => {
        async function getPrevAnnounce() {
            const res = await axios.get(`${server}/aleart`);
            const data = res.data;
            form.setValue("message", data.message);
            form.setValue("reference", data.reference);
            form.setValue("type", data.type as selectType);
            setDataLoading(false);
        }
        getPrevAnnounce()
    }, [])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            await axios.patch(`${server}/edit/alert/update`, {
                ...values
            })
            toast.success(t('form.toast.succ'), {
                description: t('form.toast.succdecs')
            });
            turnstile.reset();
            setLoading(false);
        } catch {
            toast.error(t('form.toast.fail'), {
                description: t('form.toast.faildecs')
            })
            setLoading(false);
            turnstile.reset();
        }
    }

    function clearForm() {
        form.setValue("message", "");
        form.setValue("reference", "");
        form.setValue("type", selectType.Alert);
    }

    if (dataLoading) return (
        <div className='w-full flex items-center justify-center my-12'>
            <Loader />
        </div>
    )

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.field.message')}</FormLabel>
                                <FormControl>
                                    <Textarea placeholder={t('form.field.pmessage')} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <FormField
                            control={form.control}
                            name="reference"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.field.reference')}</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder={t('form.field.preference')} {...field} />
                                    </FormControl>
                                    <FormDescription>{t('form.field.dreference')}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.field.alert')}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select an alert type w-full" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(selectType).map((type) => (<SelectItem key={type} value={type}>{t(`form.type.${type}`)}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                    </div>
                    <FormField
                        control={form.control}
                        name="captcha"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.field.captcha')}</FormLabel>
                                <FormControl>
                                    <Turnstile
                                        sitekey="0x4AAAAAABiWcS67qCPLgJew"
                                        theme='light'
                                        onVerify={(token) => {
                                            field.onChange(token)
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>{t('form.field.dcaptcha')}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex items-center justify-center flex-col-reverse gap-4 mt-8 md:mt-0'>
                        <p className="flex items-center gap-2 text-sm cursor-pointer" onClick={clearForm}><Eraser size={20} />{t('form.field.clear')}</p>
                        <Button type="submit" className='bg-primary hover:bg-primary cursor-pointer w-full md:w-fit'>{loading ? <LoaderCircleIcon className='animate-spin' /> : <Send />}{t('form.field.submit')}</Button>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default FFORM