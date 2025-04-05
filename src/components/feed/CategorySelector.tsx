'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

export type CategorySelectorProps = {
    categories: string[]
    onCategoryChange: (category: string) => void
}

export default function CategorySelector(
    { categories, onCategoryChange }: CategorySelectorProps
) {
    const [category, setCategory] = useState<string>('')

    const handleCategoryChange = (value: string) => {
        setCategory(value)
        if (onCategoryChange) {
            onCategoryChange(value)
        }
    }

    return (
        <div className='flex items-center justify-center'>
            <Label htmlFor="category" className='m-1 text-xl text-center justify-center'>Category</Label>
            <Select
                value={category}
                onValueChange={handleCategoryChange}
                defaultOpen={false}
            >
                <SelectTrigger
                    id="category"
                    className="m-2"
                >
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                            {category}
                        </SelectItem>
                    ))}
                    {/* Add other categories here
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="people">People</SelectItem>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="animals">Animals</SelectItem>
                    <SelectItem value="abstract">Abstract</SelectItem>
                    <SelectItem value="other">Other</SelectItem> */}
                </SelectContent>
            </Select>
        </div>
    )
}