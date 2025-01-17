
import { CreateInvoice } from "@/app/customComponents/CreateInvoice"
import prisma from "@/app/utils/db"
import { requireUser } from "@/app/utils/hooks"

async function getUserData(userId: string) {
    const data = prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            firstName: true,
            lastName: true,
            address: true,
            email: true,
        }
    })

    return data
}

export default async function InvoiceCreationRoute() {
    const session = await requireUser()
    const data = await getUserData(session.user?.id as string)
    return(
        <CreateInvoice
            address={data?.address as string}
            email={data?.email as string}
            firstName={data?.firstName as string}
            lastName={data?.lastName as string}
        />
    )
}