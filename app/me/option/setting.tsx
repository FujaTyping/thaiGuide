/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { onAuthStateChanged, User } from 'firebase/auth';
import auth from "@/lib/firebaseAuth";
import { server } from "@/app/config.json";
import Loader from '@/app/components/loader';
import { Check, LoaderCircle, LocateFixed, Moon, Palette, Pencil, Sun, Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Filter } from 'bad-words'
import { toast } from 'sonner';
import DeleteUserModal from './deleteUserModal';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const filter = new Filter();

function Setting() {
    const t = useTranslations('Account');
    const [user, setUser] = useState<User | null>(null);
    const [uData, setUData] = useState<any | null>(null);
    const [reqState, setReqState] = useState("");
    const [statName, setStaName] = useState(false);
    const [vName, setVName] = useState("");
    const [nameLoading, setNameLoading] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const checkUser = await axios.post(`${server}/user`, {
                    name: user.displayName,
                    pfp: user.photoURL
                }, {
                    headers: {
                        aetheruid: user.uid
                    }
                })
                setUData(checkUser.data);
                setVName(checkUser.data.name);
            }
        });

        return () => unsubscribe();
    }, [])

    async function changeYourName() {
        setNameLoading(true);
        if (vName == uData.name) {
            toast.error(t('option.name.reqsame'), {
                description: t('option.name.dereqsame')
            });
        } else if (vName.length < 4) {
            toast.error(t('option.name.reqshort'), {
                description: t('option.name.dereqshort')
            });
        } else if (filter.isProfane(vName)) {
            toast.error(t('option.name.reqipp'), {
                description: t('option.name.dereqipp')
            });
        } else {
            try {
                await axios.post(`${server}/customize/user/name`, {
                    name: vName
                }, {
                    headers: {
                        aetheruid: user?.uid
                    }
                })
                toast.success(t('option.name.succ'));
                setNameLoading(false);
                setTimeout(() => window.location.reload(),
                    5000)
            } catch {
                setNameLoading(false);
                toast.error(t('option.name.err'));
            }
        }
        setNameLoading(false);
    }

    if (!user || !uData) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        )
    }

    return (
        <>
            <div className='max-w-7xl mx-auto px-4 py-7'>
                <div className='flex flex-col md:flex-row gap-4 md:gap-0 items-center place-content-between border-primary rounded-2xl p-6 md:p-3 px-5 md:px-4 border-3'>
                    <img src={uData.pfp} alt="Avatar" className='w-28 rounded-full' />
                    <div className='flex flex-col items-center md:items-end gap-1'>
                        <div className='flex items-center gap-2'>
                            {statName ? <>
                                <Input type="text" placeholder='Name' value={vName} onChange={(e) => setVName(e.target.value)} />
                            </> : <>
                                <h1 className='text-2xl font-bold flex items-center gap-2'>{uData.name}</h1>
                            </>}
                            {statName ? <><div className='flex items-center gap-1 text-primary font-bold cursor-pointer'>
                                {
                                    nameLoading ? <>
                                        <LoaderCircle className='animate-spin' />
                                    </> : <>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Check onClick={changeYourName} />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t('option.name.confirm')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </>
                                }

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <X onClick={() => setStaName(false)} />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('option.name.cancel')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div></> : <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Pencil className='text-primary font-bold cursor-pointer' onClick={() => setStaName(true)} />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{t('option.name.hint')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </>}
                        </div>
                        <p>{user.email}</p>
                    </div>
                </div>
                <div className='pt-5 flex flex-col gap-3 w-full'>
                    <div className='flex items-center place-content-between'>
                        <h2 className='flex items-center gap-2 font-semibold'><Palette className='text-primary font-bold' /> Theme</h2>
                        <div className='bg-primary rounded-md' >
                            <Select onValueChange={(e) => setTheme(e)} value={theme} >
                                <SelectTrigger className="w-[150px] text-white" >
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light" className='flex items-center gap-2'><Sun />Light</SelectItem>
                                    <SelectItem value="dark" className='flex items-center gap-2'><Moon />Dark</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className='flex items-center place-content-between'>
                        <h2 className='flex items-center gap-2 font-semibold'><LocateFixed className='text-primary font-bold' /> {t('option.perms.location')}</h2>
                        <Button disabled className='cursor-not-allowed'>
                            {t('option.perms.notg')}
                        </Button>
                    </div>
                    <div className='flex items-center place-content-between'>
                        <h2 className='flex items-center gap-2 font-semibold'><Trash2 className='text-primary font-bold' /> {t('option.delete.btnla')}</h2>
                        <Button onClick={() => { setReqState(""); setDeleteOpen(true); }}>
                            {t('option.delete.btn')}
                        </Button>
                    </div>
                </div>
            </div >
            <DeleteUserModal open={deleteOpen} setOpen={setDeleteOpen} reqState={reqState} setReqState={setReqState} user={user} />
        </>
    )
}

export default Setting