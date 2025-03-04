'use client'

import { LoginForm } from "@/components/ui/login-form"
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
    const router = useRouter()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.target as HTMLFormElement
        const formData = new FormData(form)
        const email = formData.get('email')
        const password = formData.get('password')

        console.log(email, password)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            if (response.redirected) {
                router.push(response.url)
            } else if (response.ok) {
                const result = await response.json()
                console.log(result)
            }

        } catch (error) {
            console.error('An unexpected error occurred:', error)
        }
    }

    return (
        <div>
            <div className="flex h-screen bg-gray-400">
                <div className='lg:h-screen lg:overflow-hidden inset-0 absolute lg:relative'>
                    <Image
                        src="/trees_vertical.jpg"
                        width={960}
                        height={1080}
                        alt="landscape"
                        className="h-full object-cover lg:blur-0 blur-lg opacity-30 lg:opacity-95"
                    />
                </div>
                <div className="grow m-4 w-full lg:w-1/2 flex items-center justify-center relatize z-10">
                    <LoginForm onSubmit={handleSubmit} className="w-full max-w-sm" />
                </div>
            </div>
        </div>
    )
}