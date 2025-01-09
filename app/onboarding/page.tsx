'use client'

import { useActionState } from 'react'
import { onboardUser } from '../actions'
import { useForm } from '@conform-to/react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '../customComponents/SubmitButtons'
import { parseWithZod } from '@conform-to/zod'
import { onboardingSchema } from '../utils/zodSchemas'

export default function Onboarding() {
    //  For validation w/ form submission using conform and zod
    //  Takes the response from the server action and to display errors below, if any
    const [ lastResult, action  ] = useActionState(onboardUser, undefined)
    const [ form, fields ] = useForm({
      lastResult,
      // Client-side validation - same as server-side in actions.ts
      onValidate({ formData }) {
        return parseWithZod(formData, {
          schema: onboardingSchema,
        })
      },
      shouldValidate: 'onBlur',   // Validate when click out of input
      shouldRevalidate: 'onInput',    // Re-Validate when click into input
    })

    return (
        <div className="min-h-screen w-screen flex items-center justify-center">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
            </div>
            <Card className="max-w-sm mx-auto">
                <CardHeader>
                    <CardTitle className="text-xl">
                        You are almost finished!
                    </CardTitle>
                    <CardDescription>
                        Enter your information to create your account.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                      className="grid gap-4"
                      action={action} // from form validation above
                      id={form.id}
                      onSubmit={form.onSubmit}
                      noValidate
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>First name</Label>
                                <Input
                                  name={fields.firstName.name}
                                  key={fields.firstName.key}
                                  defaultValue={fields.firstName.initialValue}
                                  placeholder="John"
                                />
                                <p className='text-red-500 text-sm'>
                                  {fields.firstName.errors}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Last name</Label>
                                <Input
                                  name={fields.lastName.name}
                                  key={fields.lastName.key}
                                  defaultValue={fields.lastName.initialValue}
                                  placeholder="Doe"
                                />
                                <p className='text-red-500 text-sm'>
                                  {fields.lastName.errors}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Address</Label>
                            <Input
                              name={fields.address.name}
                              key={fields.address.key}
                              defaultValue={fields.address.initialValue}
                              placeholder="Doe"
                            />
                            <p className='text-red-500 text-sm'>
                              {fields.address.errors}
                            </p>
                        </div>

                        <SubmitButton text="Complete Onboarding" />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
