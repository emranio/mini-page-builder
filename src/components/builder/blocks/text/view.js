import React from 'react';
import { Text } from '@mantine/core';

/**
 * TextBlockView component - Simplified with automatic prop handling
 * All common functionality (click handlers, prop defaults, memoization) is handled by BlockFactory
 * Wrapper div and click handling moved to BlockFactory for consistency across all blocks
 */
const TextBlockView = ({
    content,
}) => {
    return (
        <>
            {content}
        </>
    );
};

export default TextBlockView;
