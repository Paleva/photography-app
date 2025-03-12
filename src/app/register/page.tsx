'use client'

import { RegisterForm } from "@/components/ui/register-form"
import { CameraIcon } from "lucide-react"
import Image from 'next/image'
import Link from "next/link"

export default function AuthPage() {
    return (
        <div className="relative h-screen w-screen">
            {/* Background image that covers the entire screen */}
            {/* <div className="absolute inset-0 bg-black/30 z-10"></div> */}
            <div className="absolute top-5 left-5 z-30 ml-7">
                <Link href="/">
                    <CameraIcon color="white" size={35} />
                </Link>
            </div>
            <div className="absolute inset-0 z-0 bg-gray-900">
                <Image
                    src="/pexels-pixabay-257092.jpg"
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