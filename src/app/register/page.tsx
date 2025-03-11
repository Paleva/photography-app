'use client'

import { RegisterForm } from "@/components/ui/register-form"
import Image from 'next/image'

export default function AuthPage() {
    return (
        <div className="relative h-screen w-screen">
            {/* Background image that covers the entire screen */}
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <div className="absolute inset-0 z-0 bg-black">
                <Image
                    src="/trees_vertical.jpg"
                    fill
                    priority
                    alt="landscape"
                    className="object-cover w-full h-full  blur-lg opacity-50"
                />
            </div>

            {/* Overlay for better form visibility */}

            {/* Centered form container */}
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                <RegisterForm className="w-96 md:w-[450px] bg-white/90 rounded-lg shadow-xl" />
            </div>
        </div>
    )
}