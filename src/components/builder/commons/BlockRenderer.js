import React from 'react';
// ItemTypes is not used in this file
// import { ItemTypes } from '../../../utils/DragTypes';
import DraggableElement from './DraggableElement';
import { useBuilder } from '../../../contexts/BuilderReducer';
import blockManager from '../../../utils/BlockManager';

const BlockRenderer = ({ element }) => {
    // isDragging is not used in this component
    const { /* isDragging */ } = useBuilder();

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
        <DraggableElement
            id={element.id}
            type={element.type}
            parentId={element.parentId}
        >
            {renderBlockContent()}
        </DraggableElement>
    );
};

export default BlockRenderer;
