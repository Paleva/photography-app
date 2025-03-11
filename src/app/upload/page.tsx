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
import Navbar from '@/components/home/navbar';

export default function UploadPage() {

    const [file, setFile] = useState<File>()
    const [pending, setPending] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')

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
        if (!file) return

        setPending(true)
        setUploadSuccess(false)

        try {
            const data = new FormData()
            data.set('file', file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            })

            if (!res.ok) throw new Error(await res.text())
            setUploadSuccess(true)
        } catch (error) {
            console.error(error)
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
            <div className="container mx-auto px-4 py-8 max-w-6xl mt-16">
                <h1 className="text-3xl font-bold text-center mb-8 md:text-4xl">
                    Upload Your Photo
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Upload Section */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Select Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={upload} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor='file'>Choose a photo</Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        name='file'
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className='hover:bg-gray-100 focus:bg-gray-50 transition-colors'
                                    />
                                </div>

                                <Button
                                    disabled={pending}
                                    type='submit'
                                    id='upload'
                                    className="w-full">
                                    {pending ? 'Uploading...' : 'Upload Image'}
                                </Button>

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
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Image Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full aspect-square bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center p-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-500 mt-2">No image selected</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Details Section */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Image Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                                <Label htmlFor="category">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger id="category" className="w-full">
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
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}