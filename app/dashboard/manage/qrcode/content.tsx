"use client";

import React, { useState, useEffect } from 'react'
import { DataTable } from './table/table';
import { columns, DataSchema } from './table/column';
import tgFetch from '@/lib/fetch';
import { server } from '@/app/config.json';
import Loader from '@/app/components/loader';

function Content() {
    const [data, setData] = useState<DataSchema[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData() {
            setLoading(true);
            const datt = await tgFetch({ url: `${server}/edit/code/getall` })
            setData(datt.data);
            setLoading(false);
        }
        getData();
    }, [])

    if (loading) {
        return (
            <div className='w-full flex items-center justify-center my-12'>
                <Loader />
            </div>
        );
    }

    return (
        <>
            <DataTable columns={columns} data={data} />
        </>
    )
}

export default Content