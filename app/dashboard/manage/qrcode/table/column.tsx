"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Check, X, CircleHelp } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
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
        return useTranslations("Dashboard.item.qrcode.table")
    }

    return [
        {
            accessorKey: "id",
            header: () => T()("id"),
        },
        {
            accessorKey: "name",
            header: () => T()("name"),
        },
        {
            accessorKey: "points",
            header: () => T()("points"),
        },
        {
            accessorKey: "province",
            header: () => T()("province"),
            cell: ({ row }) => {
                const province: string = row.getValue("province")
                return <div className="capitalize">{province}</div>
            },
        },
        {
            accessorKey: "otpp",
            header: () => {
                const t = T();
                return <p className="flex items-center gap-2">{t('otpp')}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CircleHelp size={18} className="cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('otptool')}</p>
                        </TooltipContent>
                    </Tooltip></p>
            },
            cell: ({ row }) => {
                const isYes = row.getValue("otpp")
                return <div>{isYes ? <Check size={18} className="text-primary" /> : <X size={18} className="text-primary" />}</div>
            },
        }
    ]
})();