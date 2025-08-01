import React, { memo, useRef } from 'react';
import { DropZone } from '../../commons';

/**
 * ContainerBlockView component - Simplified with new architecture
 * Wrapper div and click handling are handled by BlockFactory
 */
const ContainerBlockView = memo(({
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

export default ContainerBlockView;
