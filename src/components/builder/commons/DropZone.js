import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useBuilder } from '../../../data/BuilderReducer';
import { BlockRenderer } from './index';
import PositionalDropZone from './PositionalDropZone';

const DropZone = ({ parentId, layoutClass = 'vertical-layout' }) => {
    const { createBlock, moveBlock, getBlocks, isDragging } = useBuilder();

    const blocks = getBlocks(parentId);

    // Set up the droppable area
    const {
        setNodeRef,
        isOver
    } = useDroppable({
        id: `dropzone-${parentId || 'root'}`,
        data: {
            parentId,
            index: blocks.length, // Default to end of list
            acceptsChildren: true
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={`drop-zone vertical-layout ${isOver ? 'drop-zone-hover' : ''} ${isDragging ? 'during-drag' : ''}`}
            data-parent-id={parentId}
        >
            {/* Drop zone at the top */}
            <PositionalDropZone parentId={parentId} index={0} position="top" />

            {blocks.map((block, index) => (
                <React.Fragment key={block.id}>
                    <BlockRenderer element={block} />
                    {/* Drop zone after each block */}
                    <PositionalDropZone parentId={parentId} index={index + 1} position="between" />
                </React.Fragment>
            ))}
        </div>
    );
};

export default DropZone;
