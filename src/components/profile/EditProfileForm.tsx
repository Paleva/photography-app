"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useActionState, useEffect, useState } from "react"
import { postProfileInfo } from '@/app/actions/user/actions'
import Compressor from 'compressorjs';

export function EditProfileForm({
    username,
    bio,
    userId,
    onUpdate
}: {
    username: string,
    bio: string,
    userId: number,
    onUpdate: () => Promise<void>
}) {
    const [state, action, pending] = useActionState(postProfileInfo, { errors: {} })

    const [edit, setEdit] = useState(false)
    const [compressedFile, setCompressedFile] = useState<File | null>(null)

    // Custom action wrapper that will include our compressed file
    const enhancedAction = async (formData: FormData) => {
        // If we have a compressed file, replace the avatar in formData
        if (compressedFile) {
            formData.set('avatar', compressedFile);
        }

        // Pass the modified formData to the original action
        return action(formData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setCompressedFile(null);
            return;
        }

        if (file.size < 1024 * 1024) return setCompressedFile(file); // If file is already small enough, no need to compress

        new Compressor(file, {
            quality: 0.6, // Lower quality for larger files
            maxWidth: 800, // Reduce dimensions
            maxHeight: 800,
            convertSize: 800000, // Try to get under 800KB
            success(result) {
                // Create a new File from the compressed Blob
                const compressedImageFile = new File([result], file.name, {
                    type: file.type,
                    lastModified: Date.now()
                });

                // If still too large, try even more aggressive compression
                const compressedSizeMB = compressedImageFile.size / (1024 * 1024);

                if (compressedSizeMB > 1) {
                    // Try even more aggressive compression
                    new Compressor(compressedImageFile, {
                        quality: 0.2,
                        maxWidth: 600,
                        maxHeight: 600,
                        success(finalResult) {
                            const finalCompressedFile = new File([finalResult], file.name, {
                                type: file.type,
                                lastModified: Date.now()
                            });
                        },
                        error(err) {
                            console.error(err);
                            setCompressedFile(null);
                        }
                    });
                } else {
                    setCompressedFile(compressedImageFile);
                }
            },
            error(err) {
                console.error('Compression failed:', err);
                setCompressedFile(null);
            },
        });
    };

    useEffect(() => {
        if (state?.success) {
            setEdit(false);
            setCompressedFile(null);
            onUpdate()
        }
    }, [state?.success, onUpdate])

    return (
        <>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold ">Edit Profile</h2>
                <Button onClick={() => setEdit(true)} variant="outline">Edit Profile</Button>
            </div>
            <form action={enhancedAction} >
                <div className="space-y-3 pb-4">
                    <Label htmlFor="username" className="block text-sm font-medium">
                        Username
                    </Label>
                    <Input
                        name="username"
                        id="username"
                        type='text'
                        placeholder="Enter username"
                        defaultValue={username}
                        disabled={!edit}
                    />
                    {state?.errors?.username && (
                        <p className='text-red-500 text-sm'>{state.errors.username}</p>
                    )}
                </div>

                <div className="space-y-3 pb-4">
                    <Label htmlFor="bio" className="block text-sm font-medium">
                        Bio
                    </Label>
                    <Input
                        name='bio'
                        id="bio"
                        placeholder="Write something about yourself..."
                        disabled={!edit}
                        defaultValue={bio}
                    />
                    {state?.errors?.bio && (
                        <p className='text-red-500 text-sm'>{state.errors.bio}</p>
                    )}
                </div>

                <div className="space-y-3 pb-4">
                    <Label htmlFor="avatar" className="block text-sm font-medium">
                        Profile Picture
                    </Label>
                    <div className="flex items-center gap-2">
                        <Input
                            name="avatar"
                            id="avatar"
                            type="file"
                            accept="image/*"
                            defaultValue={undefined}
                            disabled={!edit}
                            onChange={handleFileChange}
                            className="border-gray-300 rounded-md hover:ring hover:ring-opacity-50"
                        />
                    </div>
                    {state?.errors?.file && (
                        <p className='text-red-500 text-sm'>{state.errors.file}</p>
                    )}
                </div>
                {state?.message && (
                    <div className="p-3 my-2 bg-green-100 text-green-700 rounded-md border border-green-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Profile updated successfully!
                    </div>
                )}
                <Input hidden type="text" name="userId" defaultValue={userId} />
                <Button type='submit' disabled={!edit || pending} aria-disabled={pending}> Save Changes</Button>

                {edit && <Button onClick={() => setEdit(false)} className="ml-3" variant="outline">Cancel</Button>}
            </form>
        </>
    )
}
