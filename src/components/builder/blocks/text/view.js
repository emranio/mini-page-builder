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
    fontSize,
    fontWeight,
    color,
    textAlign
}) => {
    return (
        <>
            <Paragraph
                className="text-block"
                style={{
                    fontSize: `${fontSize}px`,
                    fontWeight,
                    color,
                    textAlign,
                    margin: 0
                }}
            >
                {content}
            </Paragraph>
        </>
    );
};

export default TextBlockView;
