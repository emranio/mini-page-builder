import React from 'react';
import Draggable from './Draggable';
import blockManager from './block/blockManager';

const BlockRenderer = ({ element }) => {
    if (!element) return null;

    // Force remount key to ensure component updates properly
    const blockKey = `${element.id}-${JSON.stringify(element.props)}`;

    // Wrap the block content in a draggable wrapper
    const renderBlockContent = () => {
        // Get block definition from BlockManager by type
        const blockDefinition = blockManager.getBlock(element.type);

        if (blockDefinition && blockDefinition.view) {
            const BlockComponent = blockDefinition.view;
            return <BlockComponent key={blockKey} id={element.id} {...element.props} />;
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
};

export default BlockRenderer;
