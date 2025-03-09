'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';


export default function UploadPage() {

    const [file, setFile] = useState<File>()

    const upload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!file) return

        try {
            const data = new FormData()
            data.set('file', file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            })

            if (!res.ok) throw new Error(await res.text())
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex items-center gap-40">
                <div className="flex flex-col gap-4">
                    <h1 className="text-4xl font-bold">
                        Upload a photo
                    </h1>
                    <form onSubmit={upload}>
                        <Label htmlFor='file'>Photo</Label>
                        <Input
                            type="file"
                            name='file'
                            onChange={(e) => setFile(e.target.files?.[0])}
                            className='hover:bg-gray-200 active:bg-gray-400' />
                        <Button type='submit' id='upload' className="">Upload</Button>
                    </form>
                </div>
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">Preview</h2>
                    <div className="w-96 h-96 bg-gray-200 ">
                        PICTURE MAYBE YES
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h2>
                        DESCRIPTION
                    </h2>
                    <h2>
                        CATEGORY SELECTION
                    </h2>
                </div>
            </div>
        </div>
    )
}