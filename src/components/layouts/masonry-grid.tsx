'use client'

import React, { useEffect, useRef } from 'react'
import Masonry from 'react-masonry-css'

interface MasonryGridProps {
    children: React.ReactNode
    className?: string
}

export function MasonryGrid({ children, className = '' }: MasonryGridProps) {
    const masonryRef = useRef<HTMLDivElement>(null);

    // These breakpoints determine how many columns to show at different screen widths
    const breakpointColumnsObj = {
        default: 4, // Default to 4 columns
        1400: 3, // 3 columns for large devices
        1200: 2, // 2 columns for medium devices
        800: 1  // 1 column for small devices
    }

    // Force layout recalculation when children change
    useEffect(() => {
        if (masonryRef.current) {
            const event = new Event('resize');
            window.dispatchEvent(event);
        }
    }, [children]);

    return (
        <div ref={masonryRef}>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className={`flex -ml-4 w-auto ${className}`}
                columnClassName="pl-4 bg-clip-padding"
            >
                {children}
            </Masonry>
        </div>
    )
}
