"use client"

import { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

export type DataSchema = {
    id: string
    name: string
    points: number
    province: string
    otpp: boolean
}

export const columns: ColumnDef<DataSchema>[] = (() => {
    const T = () => {
        return useTranslations('Dashboard.item.activities');
    }

    return [
        {
            accessorKey: "id",
            header: () => T()("id"),
        },
        {
            accessorKey: "title",
            header: () => T()("title"),
        },
        {
            accessorKey: "fileid",
            header: () => {
                return;
            },
            cell: () => {
                return;
            }
        },
        {
            accessorKey: "province",
            header: () => T()("province"),
            cell: ({ row }) => {
                const province: string = row.getValue("province")
                return <div className="capitalize">{province}</div>
            },
        }
    ]
})();