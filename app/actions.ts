"use server"

import { requireUser } from "./utils/hooks"
import { parseWithZod } from "@conform-to/zod"
import { invoiceSchema, onboardingSchema } from "./utils/zodSchemas"
import prisma from "./utils/db"
import { redirect } from "next/navigation"
import { emailClient } from "./utils/mailtrap"
import { formatCurrency } from "./utils/formatCurrency"

/**
 * Actions:
 * -onboardUser
 * -createInvoice
 * -editInvoice
 * -deleteinvoice
 * -markAsPaid
 */

export async function onboardUser(prevState: any, formData: FormData) {
    const session = await requireUser()

    // Server-side validation - same as client-side in onboarding/page.tsx
    const submission = parseWithZod(formData, {
        schema: onboardingSchema,
    })

    if(submission.status !== "success") {
        return submission.reply()
    }

    const data = await prisma.user.update({
        where: {
            id: session.user?.id,
        },
        data: {
            firstName: submission.value.firstName,
            lastName: submission.value.lastName,
            address: submission.value.address,
        }
    })
     
    return redirect("/dashboard")
}

export async function createInvoice(prevState: any, formData: FormData) {
    const session = await requireUser()

    const submission = parseWithZod(formData, {
        schema: invoiceSchema,
    })

    if(submission.status !== "success") {
        return submission.reply()
    }

    const data = await prisma.invoice.create({
        data: {
            clientAddress: submission.value.clientAddress,
            clientEmail: submission.value.clientEmail,
            clientName: submission.value.clientName,
            currency: submission.value.currency,
            date: submission.value.date,
            dueDate: submission.value.dueDate,
            fromAddress: submission.value.fromAddress,
            fromEmail: submission.value.fromEmail,
            fromName: submission.value.fromName,
            invoiceItemDescription: submission.value.invoiceItemDescription,
            invoiceItemQuantity: submission.value.invoiceItemQuantity,
            invoiceItemRate: submission.value.invoiceItemRate,
            invoiceName: submission.value.invoiceName,
            invoiceNumber: submission.value.invoiceNumber,
            status: submission.value.status,
            total: submission.value.total,
            note: submission.value.note,
            userId: session.user?.id,
        }
    })

    const sender = {
        email: 'hello@demomailtrap.com',
        name: 'Knight Solo Accounts',
    }

    emailClient.send({
        from: sender,
        to: [{ email: 'dbesq@vivaldi.net' }], // TODO:  Use submission.value.clientEmail in production
        template_uuid: "3f664c1b-2aa2-4136-b68c-145079a44b8d",
        template_variables: {
        "clientName": submission.value.clientName,
        "invoiceNumber": submission.value.invoiceNumber,
        "dueDate": new Intl.DateTimeFormat('en-US', {
            dateStyle: 'long',
        }).format(new Date(submission.value.date)),
        "totalAmount": formatCurrency({ amount: submission.value.total, currency: submission.value.currency as any }),
        // TODO:  Use real link in production
        "invoiceLink": `http://localhost:3000/api/invoice/${data.id}`
        }
    })

    return redirect('/dashboard/invoices')
}

export async function editInvoice(prevState: any, formData: FormData) {
    const session = await requireUser()

    const submission = parseWithZod(formData, {
        schema: invoiceSchema, 
    })

    if(submission.status !== 'success') {
        return submission.reply()
    }

    const data = await prisma.invoice.update({
        where: {
            id: formData.get('id') as string,
            userId: session.user?.id,
        },
        data: {
            clientAddress: submission.value.clientAddress,
            clientEmail: submission.value.clientEmail,
            clientName: submission.value.clientName,
            currency: submission.value.currency,
            date: submission.value.date,
            dueDate: submission.value.dueDate,
            fromAddress: submission.value.fromAddress,
            fromEmail: submission.value.fromEmail,
            fromName: submission.value.fromName,
            invoiceItemDescription: submission.value.invoiceItemDescription,
            invoiceItemQuantity: submission.value.invoiceItemQuantity,
            invoiceItemRate: submission.value.invoiceItemRate,
            invoiceName: submission.value.invoiceName,
            invoiceNumber: submission.value.invoiceNumber,
            status: submission.value.status,
            total: submission.value.total,
            note: submission.value.note,
        }
    })

    const sender = {
        email: 'hello@demomailtrap.com',
        name: 'Knight Solo Accounts',
    }

    emailClient.send({
        from: sender,
        to: [{ email: 'dbesq@vivaldi.net' }], // TODO:  Use submission.value.clientEmail in production
        template_uuid: "a0043597-c863-43e0-8c80-bcfd51a6f42f",
        template_variables: {
        "clientName": submission.value.clientName,
        "invoiceNumber": submission.value.invoiceNumber,
        "dueDate": new Intl.DateTimeFormat('en-US', {
            dateStyle: 'long',
        }).format(new Date(submission.value.date)),
        "totalAmount": formatCurrency({ amount: submission.value.total, currency: submission.value.currency as any }),
        // TODO:  Use real link in production
        "invoiceLink": `http://localhost:3000/api/invoice/${data.id}`
        }
    })

    return redirect('/dashboard/invoices')
}

export async function deleteInvoice(invoiceId: string) {
    const session = await requireUser()

    const data = await prisma.invoice.delete({
        where: {
            userId: session.user?.id,
            id: invoiceId,
        }
    })

    return redirect('/dashboard/invoices')
}

export async function markAsPaid(invoiceId: string) {
    const session = await requireUser()

    const data = await prisma.invoice.update({
        where: {
            userId: session.user?.id,
            id: invoiceId,
        },
        data: {
            status: 'PAID',
        }
    })

    return redirect('/dashboard/invoices')
}