import React, { memo, useRef, useCallback } from 'react';
import { useBuilder } from '../../../../data/BuilderReducer';
import { DropZone } from '../../commons';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { withBaseBlock } from '../../commons/block';

/**
 * ExampleContainerBlockView component - Optimized with React.memo for performance
 * Wrapper div and click handling moved to BlockFactory for consistency across all blocks
 */
const ExampleContainerBlockView = memo(({
    id,
}) => {
    const containerRef = useRef(null);
    return (
        <>
            <div className="example-container-content" ref={containerRef}>
                <DropZone parentId={id} />
            </div>
        </>
    );
});

export default withBaseBlock(ExampleContainerBlockView, 'example-container');
