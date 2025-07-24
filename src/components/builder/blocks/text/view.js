import React, { memo, useCallback } from 'react';
import { Typography } from 'antd';
import { withBaseBlock } from '../../commons/block';
import { useBuilder } from '../../../../contexts/BuilderReducer';

const { Paragraph } = Typography;

/**
 * TextBlockView component - Optimized with React.memo for performance
 */
const TextBlockView = memo(({
    id,
    content = 'Simple text block',
    fontSize = 14,
    fontWeight = 'normal',
    color = '#000000',
    textAlign = 'left',
    uniqueBlockId
}) => {
    const { setSelectedBlockId } = useBuilder();

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        setSelectedBlockId(id);
    }, [id, setSelectedBlockId]);

    return (
        <div id={uniqueBlockId}>
            <Paragraph
                className="text-block"
                onClick={handleClick}
                style={{
                    fontSize: `${fontSize}px`,
                    fontWeight,
                    color,
                    textAlign,
                    margin: 0,
                    cursor: 'pointer'
                }}
            >
                {content || 'Simple text block'}
            </Paragraph>
        </div>
    );
});

export default withBaseBlock(TextBlockView, 'text');
