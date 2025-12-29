"use client"

import React, { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Plus, ScanEye, Trash2 } from "lucide-react"
import { motion } from "motion/react"
import NF from "@/assets/media/card/icon/notfound.svg";
import DeleteModal from "./deleteModal"
import { useTranslations } from "next-intl";
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditModal from "./editModal"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [open, setOpen] = React.useState(false);
  const [targetId, setTargetId] = React.useState('');
  const [targetFileId, setTargetFileId] = React.useState('');
  const t = useTranslations('Dashboard.item.activities');
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState('');

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
    },
  })

  return (
    <>
      <div className="flex items-center place-content-between pb-4 gap-3">
        <Input
          placeholder={t('table.search')}
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={'/dashboard/manage/activities/add'}>
              <Button className="bg-primary hover:bg-primary cursor-pointer"><Plus /></Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('table.add')}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-primary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-primary">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white font-bold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
                <TableHead key={'action'} className="text-white font-bold">
                  {t('table.action')}
                </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="font-semibold space-y-9"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  <TableCell key={'action'} className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Pencil size={18} className="text-primary cursor-pointer"
                          onClick={() => {
                            setEditOpen(true);
                            setEditId(row.getValue('id'));
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('table.editD')}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Trash2 size={18} onClick={() => {
                          setOpen(true)
                          setTargetId(row.getValue('id'))
                          setTargetFileId(row.getValue('fileid'))
                        }} className="text-primary cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('table.tooldel')}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={`/activity/${row.getValue('id')}`}>
                          <ScanEye size={18} className="text-primary cursor-pointer" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('table.toolview')}</p>
                      </TooltipContent>
                    </Tooltip >
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-62 text-center relative">
                  <div className='flex items-center py-8 flex-col justify-center gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                    <motion.div
                      animate={{
                        x: [0, -10, 10, -10, 10, -5, 5, 0],
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                    >
                      <img src={NF.src} alt="Not Found" className='w-32 translate-x-3' />
                    </motion.div>
                    <p className='font-semibold'>{t('table.mty')}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          className="border-primary border-2"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t('table.prev')}
        </Button>
        <Button
          variant="outline"
          className="border-primary border-2"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t('table.next')}
        </Button>
      </div>
      <DeleteModal open={open} setOpen={setOpen} id={targetId} fileid={targetFileId} />
      <EditModal open={editOpen} setOpen={setEditOpen} id={editId} />
    </>
  )
}