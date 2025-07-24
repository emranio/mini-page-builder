import React from 'react';
import { Typography } from 'antd';

const { Paragraph } = Typography;

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
            <Paragraph
                className="text-block"
            >
                {content}
            </Paragraph>
        </>
    );
};

export default TextBlockView;
