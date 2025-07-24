import React, { memo, useRef } from 'react';
import { DropZone } from '../../commons';

/**
 * ExampleContainerBlockView component - Simplified with new architecture
 * Wrapper div and click handling are handled by BlockFactory
 */
const ExampleContainerBlockView = memo(({
    id,
    padding,
    margin,
    backgroundColor,
    borderStyle,
    borderWidth,
    borderColor,
    borderRadius
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

export default ExampleContainerBlockView;
