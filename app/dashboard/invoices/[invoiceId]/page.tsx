import { notFound } from "next/navigation"
import prisma from "@/app/utils/db"
import { requireUser } from "@/app/utils/hooks"
import { EditInvoice } from "@/app/customComponents/EditInvoice"


async function getData(invoiceId: string, userId: string) {
    const data = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
            userId: userId,
        },
    })

    if(!data) {
        return notFound()
    }

    return data
}

// invoiceId in the generic below MUST HAVE same spelling as folder of this dynamic route
type Params = Promise<{invoiceId: string}>

export default async function EditInvoiceRoute({ params }: { params: Params }) {
    const { invoiceId } = await params 
    const session = await requireUser()
    const data = await getData(invoiceId, session.user?.id as string)

    return(
        <EditInvoice data={data} />
    )
}