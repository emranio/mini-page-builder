import React, { memo, useRef } from 'react';
import { DropZone } from '../../commons';

/**
 * ExampleContainerBlockView component - Simplified with new architecture
 * Wrapper div and click handling are handled by BlockFactory
 */
const ExampleContainerBlockView = memo(({
    id
}) => {
    const containerRef = useRef(null);

    return (
        <>
            <div className="container-content" ref={containerRef}>
                <DropZone parentId={id} />
            </div>
        </>
    );
});

export default ExampleContainerBlockView;
