import React, { memo } from 'react';
import Draggable from './Draggable';
import blockManager from './block/blockManager';

/**
 * BlockRenderer component - Renders individual blocks with drag functionality
 * Optimized with React.memo to prevent unnecessary re-renders
 */
const BlockRenderer = memo(({ element }) => {
    if (!element) return null;

    // Wrap the block content in a draggable wrapper
    const renderBlockContent = () => {
        // Get block definition from BlockManager by type
        const blockDefinition = blockManager.getBlock(element.type);

        if (blockDefinition && blockDefinition.view) {
            const BlockComponent = blockDefinition.view;
            return <BlockComponent id={element.id} {...element.props} />;
        }

        return <div>Unknown Block Type: {element.type}</div>;
    };

    return (
        <Draggable
            id={element.id}
            type={element.type}
            parentId={element.parentId}
        >
            {renderBlockContent()}
        </Draggable>
    );
});

export default BlockRenderer;
