import React from 'react';
import { Image } from '@mantine/core';

/**
 * ImageBlockView component - Simplified with automatic prop handling
 * All common functionality (click handlers, prop defaults, memoization) is handled by BlockFactory
 * Wrapper div and click handling moved to BlockFactory for consistency across all blocks
 */
const ImageBlockView = ({
    src,
    alt
}) => {
    return (
        <>
            <Image
                src={src}
                alt={alt}
                className="newsletter-image"
            />
        </>
    );
};

export default ImageBlockView;
