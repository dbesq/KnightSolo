'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    CheckCircle,
    DownloadCloud,
    Mail,
    MoreHorizontal,
    Pencil,
    Trash,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface iAppProps {
    id: string
    status: string
}

export function InvoiceActions({ id, status }: iAppProps) {
    const handleSendReminder = () => {
        toast.promise(
            fetch(`/api/email/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            {
                loading: 'Sending email reminder ...',
                success: 'Reminder email sent successfully.',
                error: 'Failed to send reminder email.',
            }
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary">
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/dashboard/invoices/${id}`}>
                        <Pencil className="size-4 mr-2" /> Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/api/invoice/${id}`} target="_blank">
                        <DownloadCloud className="size-4 mr-2" /> Download
                        invoice
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSendReminder}>
                    <Link href="">
                        <Mail className="size-4 mr-2" /> Reminder email
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/dashboard/invoices/${id}/delete`}>
                        <Trash className="size-4 mr-2" /> Delete invoice
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    {status !== 'PAID' && (
                        <Link href={`/dashboard/invoices/${id}/paid`}>
                            <CheckCircle className="size-4 mr-2" /> Mark as paid
                        </Link>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
