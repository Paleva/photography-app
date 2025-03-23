'use client'

import React from 'react'
import Masonry from 'react-masonry-css'

interface MasonryGridProps {
    children: React.ReactNode
    className?: string
}

export function MasonryGrid({ children, className = '' }: MasonryGridProps) {
    // These breakpoints determine how many columns to show at different screen widths
    const breakpointColumnsObj = {
        default: 3, // Default to 3 columns
        1024: 2,    // 3 columns for large devices
        768: 2,     // 2 columns for medium devices
        640: 1      // 1 column for small devices
    }

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className={`flex -ml-4 w-auto ${className}`}
            columnClassName="pl-4 bg-clip-padding"
        >
            {children}
        </Masonry>
    )
}
