"use client"

import React from "react"
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
import { Trash2 } from "lucide-react"
import { motion } from "motion/react"
import NF from "@/assets/media/card/icon/notfound.svg";
import DeleteModal from "./deleteModal"
import { useTranslations } from "next-intl"

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
  const t = useTranslations('Dashboard.item.qrcode');

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
      <div className="flex items-center pb-4">
        <Input
          placeholder={`${t('table.search')}`}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">

        <Table>
          <TableHeader className="bg-[#f7740a] hover:bg-[#f7740a]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
                  <TableCell key={'action'}>
                    <Trash2 size={18} onClick={() => {
                      setOpen(true)
                      setTargetId(row.getValue('id'))
                    }} className="text-[#f7740a] cursor-pointer" />
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
                    <p className='font-semibold'>{t('mty')}</p>
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
          className="border-[#f7740a] border-2"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t('prev')}
        </Button>
        <Button
          variant="outline"
          className="border-[#f7740a] border-2"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t('next')}
        </Button>
      </div>
      <DeleteModal open={open} setOpen={setOpen} id={targetId} />
    </>
  )
}