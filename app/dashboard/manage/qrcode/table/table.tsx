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
import { FileScan, Plus, Trash2 } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios"
import { server } from "@/app/config.json";
import Loader from "@/app/components/loader"

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
  const [viewDoc, setViewDoc] = React.useState(false);;
  const [qrData, setQrData] = React.useState<string | undefined>();

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

  async function getDocfromID({ id, name, otpp }: { id: String, name: String, otpp: Boolean }) {
    setQrData(undefined);
    setViewDoc(true);
    const response = await axios.post(`${server}/code/gen`, {
      id: id,
      name: name,
      ot: otpp
    }, {
      responseType: 'arraybuffer'
    });

    const base64 = btoa(
      new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    setQrData(`data:image/png;base64,${base64}`);
  }

  return (
    <>
      <div className="flex items-center place-content-between pb-4 gap-3">
        <Input
          placeholder={`${t('table.search')}`}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={'/dashboard/manage/qrcode/create'}>
              <Button className="bg-primary hover:bg-primary cursor-pointer"><Plus /></Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('newqr')}</p>
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
                        <Trash2 size={18} onClick={() => {
                          setOpen(true)
                          setTargetId(row.getValue('id'))
                        }} className="text-primary cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('delqr')}</p>
                      </TooltipContent>
                    </Tooltip >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FileScan
                          onClick={() => {
                            getDocfromID({
                              id: row.getValue('id'),
                              name: row.getValue('name'),
                              otpp: row.getValue('otpp') || false
                            });
                          }}
                          size={18} className="text-primary cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('doctool')}</p>
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
          className="border-primary border-2"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t('prev')}
        </Button>
        <Button
          variant="outline"
          className="border-primary border-2"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t('next')}
        </Button>
      </div>
      <DeleteModal open={open} setOpen={setOpen} id={targetId} />
      <Dialog onOpenChange={setViewDoc} open={viewDoc}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='text-2xl'>{t('doc')}</DialogTitle>
            {
              qrData === undefined ? <div className='w-full flex items-center justify-center my-8'><Loader /></div> : <>
                <img src={qrData} alt="Doc" className="rounded-2xl mt-3" />
              </>
            }
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}