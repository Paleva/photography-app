'use client'

import { RegisterForm } from "@/components/ui/register-form"
import Image from 'next/image'

export default function AuthPage() {
    return (
        <div>
            <div className="flex h-screen bg-gray-400">
                <div className='lg:h-screen lg:overflow-hidden inset-0 absolute lg:relative'>
                    <Image
                        src="/trees_vertical.jpg"
                        width={960}
                        height={1080}
                        alt="landscape"
                        className="h-full object-cover blur-sm md:blur-0 opacity-30 lg:opacity-95"
                    />
                </div>
                <div className="grow m-4 w-full lg:w-1/2 flex items-center justify-center relative z-10">
                    <RegisterForm className="w-full max-w-sm" />
                </div>
            </div>
        </div>
    )
}