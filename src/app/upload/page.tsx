'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CameraIcon } from 'lucide-react';
import Link from "next/link";

export default function UploadPage() {

    const [file, setFile] = useState<File>()
    const [pending, setPending] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [title, setTitle] = useState('')
    const [validationError, setValidationError] = useState<string | null>(null)


    // Generate preview URL when file changes
    useEffect(() => {
        if (!file) {
            setPreviewUrl(null)
            return
        }

        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)

        // Clean up the URL when component unmounts
        return () => {
            URL.revokeObjectURL(objectUrl)
        }
    }, [file])

    const upload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setValidationError(null)

        if (!file) {
            setValidationError("Please select a file")
            return
        }

        if (!title) {
            setValidationError("Please enter a title")
            return
        }

        if (!category) {
            setValidationError("Please select a category")
            return
        }

        setTitle(title.trim())
        setPending(true)
        setUploadSuccess(false)

        try {
            const data = new FormData()
            data.set('file', file)
            data.set('category', category)
            data.set('title', title)
            if (description) {
                data.set('description', description)
            }

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            })

            if (!res.ok) {
                const error = await res.json()
                console.error(error.message)
                return
            }
            setUploadSuccess(true)
        } catch (error) {
            console.error(error)
            setValidationError("Upload failed. Please try again.")
        } finally {
            setPending(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        setFile(selectedFile)
    }

    return (
        <>
            {/* <Navbar /> */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-gray-300 flex items-center px-2 pr-5">
                <Link href='/' className='ml-7'>
                    <CameraIcon color="black" size={32} className="ml-4" />
                </Link>
            </div>
            <div className="container mx-auto px-4 py-8 max-w-7xl mt-16">
                <h1 className="text-3xl font-bold text-center mb-8 md:text-4xl ">
                    Upload Your Photo
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upload Section with Details */}
                    <Card className="shadow-lg min-h-[550px] ">
                        <CardHeader className="pb-2 mt-8">
                            <CardTitle>Upload Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={upload} className="space-y-6">

                                <div className="space-y-2">
                                    <Label htmlFor='file'>Choose a photo <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        name='file'
                                        onChange={handleFileChange}
                                        accept="image/png image/jpeg image/jpg image/gif image/webp"
                                        className='hover:bg-gray-100 focus:bg-gray-50 transition-colors'
                                        required
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='title'>Title<span className="text-red-500">*</span></Label>
                                    <Input
                                        id='title'
                                        type='text'
                                        placeholder='Add a title for your image'
                                        className='hover:bg-gray-100 focus:bg-gray-50 transition-colors'
                                        onChange={(e) => setTitle(e.target.value)}
                                        value={title}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Add a description for your image"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="resize-none"
                                        rows={4}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={category}
                                        onValueChange={setCategory}
                                        required
                                    >
                                        <SelectTrigger
                                            id="category"
                                            className={`w-full`}
                                        >
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nature">Nature</SelectItem>
                                            <SelectItem value="people">People</SelectItem>
                                            <SelectItem value="urban">Urban</SelectItem>
                                            <SelectItem value="animals">Animals</SelectItem>
                                            <SelectItem value="abstract">Abstract</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {/* {!category && <p className="text-sm text-red-500 mt-1">Category is required</p>} */}
                                </div>

                                <Button
                                    disabled={pending}
                                    type='submit'
                                    id='upload'
                                    className="w-full mt-4">
                                    {pending ? 'Uploading...' : 'Upload Image'}
                                </Button>

                                {validationError && (
                                    <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                                        {validationError}
                                    </div>
                                )}
                                {uploadSuccess && (
                                    <div className="p-3 bg-green-100 text-green-700 rounded-md border border-green-200 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Photo uploaded successfully!
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>

                    {/* Preview Section */}
                    <Card className="shadow-lg min-h-[550px]">
                        <CardHeader className="pb-2 mt-8">
                            <CardTitle>Image Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center p-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-500 mt-4 text-lg">No image selected</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}