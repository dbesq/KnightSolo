import prisma from '@/app/utils/db'
import { requireUser } from '@/app/utils/hooks'
import { emailClient } from '@/app/utils/mailtrap'
import { NextResponse } from 'next/server'

export async function POST(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ invoiceId: string }>
    }
) {
    try {
        const session = await requireUser()

        const { invoiceId } = await params

        const invoiceData = await prisma.invoice.findUnique({
            where: {
                id: invoiceId,
                userId: session.user?.id,
            },
        })

        if (!invoiceData) {
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            )
        }

        const sender = {
            email: 'hello@demomailtrap.com',
            name: 'Knight Solo Accounts', // TODO:  Use submission.value.clientEmail in production
        }

        emailClient.send({
            from: sender,
            to: [{ email: 'dbesq@vivaldi.net' }], // TODO:  Use submission.value.clientEmail in production
            template_uuid: '414a652e-45b0-4f74-9b9b-fada3a3b1e4e',
            template_variables: {
                first_name: invoiceData.clientName,
                company_info_name: 'KnightSolo',
                company_info_address: '112 Mockingbird Lane',
                company_info_city: 'Dallas, TX',
                company_info_zip_code: '75206',
                company_info_country: 'US',
            },
        })

        return NextResponse.json({
            success: true,
        })
    } catch (error) {
        console.log(`api/email/[invoiceId] route error: ${error}`)
        return NextResponse.json(
            { error: 'Failed to send email reminder' },
            { status: 500 }
        )
    }
}
