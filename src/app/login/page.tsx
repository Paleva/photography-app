'use client'

import { LoginForm } from "@/components/ui/login-form"
import Image from 'next/image'
import Link from "next/link"
import { CameraIcon } from "lucide-react"

export default function AuthPage() {
    return (
        <div className="relative h-screen w-screen">
            {/* Background image that covers the entire screen */}
            {/* Overlay for better form visibility */}
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <div className="absolute top-5 left-5 z-30 ml-7">
                <Link href="/">
                    <CameraIcon color="white" size={35} />
                </Link>
            </div>
            <div className="absolute inset-0 z-0 bg-gray-800">
                <Image
                    src="/landscape.jpg"
                    fill
                    priority
                    alt="landscape"
                    className="object-cover w-full h-full  blur-lg opacity-50"
                />
            </div>


            {/* Centered form container */}
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                <LoginForm className="w-96 md:w-[450px] bg-white/90 rounded-lg shadow-xl" />
            </div>
        </div>
    )
}