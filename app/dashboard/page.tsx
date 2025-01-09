import { ReactNode, Suspense } from 'react'
import { signOut } from '../utils/auth'
import { requireUser } from '../utils/hooks'
import { DashboardBlocks } from '../customComponents/DashboardBlocks'
import { InvoiceGraph } from '../customComponents/InvoiceGraph'
import { RecentInvoices } from '../customComponents/RecentInvoices'
import prisma from '../utils/db'
import { EmptyState } from '../customComponents/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'

async function getData(userId: string) {
    const data = await prisma.invoice.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
        },
    })

    return data
}

export default async function DashboardRoute() {
    const session = await requireUser()
    const data = await getData(session.user?.id as string)

    return (
        <>
            {data.length < 1 ? (
                <EmptyState
                  title='No invoices found'
                  description='Create an invoice to see it here'
                  buttonText='Create invoice'
                  href='/dashboard/invoices/create'
                />
            ) : (
                <>
                  <Suspense fallback={ <Skeleton className='h-full w-full flex-1' /> }>
                    <DashboardBlocks />
                    <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
                        <InvoiceGraph />
                        <RecentInvoices />
                    </div>
                  </Suspense>
                </>
            )}
        </>
    )
}
