import React from 'react';
import { Typography } from 'antd';

const { Paragraph } = Typography;

/**
 * TextBlockView component - Simplified with automatic prop handling
 * All common functionality (click handlers, prop defaults, memoization) is handled by BlockFactory
 */
const TextBlockView = ({
    content,
    fontSize,
    fontWeight,
    color,
    textAlign,
    uniqueBlockId,
    onClick
}) => {
    return (
        <div id={uniqueBlockId}>
            <Paragraph
                className="text-block"
                onClick={onClick}
            >
                {content}
            </Paragraph>
        </div>
    );
};

export default TextBlockView;
