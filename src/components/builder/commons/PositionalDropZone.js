import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useBuilder } from '../../../data/BuilderReducer';

const PositionalDropZone = ({ parentId, index, position = 'between' }) => {
    const { createBlock, moveBlock, getBlocks, isDragging } = useBuilder();

    // Set up the droppable area for precise positioning
    const {
        setNodeRef,
        isOver
    } = useDroppable({
        id: `position-${parentId || 'root'}-${index}`,
        data: {
            parentId,
            index,
            isPositional: true
        }
    });

    // Don't render if not dragging to avoid taking up space
    if (!isDragging) {
        return null;
    }

    return (
        <div
            ref={setNodeRef}
            className={`positional-drop-zone ${position} ${isOver ? 'positional-drop-zone-hover' : ''}`}
            data-parent-id={parentId}
            data-index={index}
        />
    );
};

export default PositionalDropZone;
