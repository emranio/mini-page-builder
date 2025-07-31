import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../../../data/BuilderReducer';
import blockManager from './block/blockManager';
import { BlockRenderer } from './index';
import PositionalDropZone from './PositionalDropZone';

const DropZone = ({ parentId, className = '', layoutClass = 'vertical-layout' }) => {
    const { createBlock, moveBlock, getBlocks, isDragging } = useBuilder();
    const dropZoneRef = useRef(null);

    const blocks = getBlocks(parentId);

    // Get all drag types from block manager
    const acceptedTypes = blockManager.getDragTypes();

    const [{ isOver }, drop] = useDrop(() => ({
        accept: acceptedTypes,
        drop: (item, monitor) => {
            // Prevent dropping if this is a child of the event path (prevents duplicate drops)
            if (monitor.didDrop()) {
                return;
            }

            // Prevent dropping into itself if it's already a container item
            if (item.id && item.parentId === parentId) {
                return;
            }

            // If it's a new block, create it at the end (fallback for direct drops on container)
            if (!item.id) {
                const targetChildren = getBlocks(parentId);
                createBlock(item.type, parentId, {}, targetChildren.length);
            }
            // If it's an existing block being moved, move it to the end
            else if (item.id) {
                const targetChildren = getBlocks(parentId);
                moveBlock(item.id, parentId, targetChildren.length);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver({ shallow: true }),
        }),
    }));

    const setRefs = (el) => {
        dropZoneRef.current = el;
        drop(el);
    };

    return (
        <div
            ref={setRefs}
            className={`drop-zone ${className} ${layoutClass} ${isOver ? 'drop-zone-hover' : ''} ${isDragging ? 'during-drag' : ''} ${blocks.length === 0 ? 'empty-dropzone' : ''}`}
            data-parent-id={parentId}
        >
            {/* Drop zone at the top - only show when dragging */}
            {isDragging && <PositionalDropZone parentId={parentId} index={0} position="top" />}

            {blocks.map((block, index) => (
                <React.Fragment key={block.id}>
                    <BlockRenderer element={block} />
                    {/* Drop zone after each block - only show when dragging */}
                    {isDragging && <PositionalDropZone parentId={parentId} index={index + 1} position="between" />}
                </React.Fragment>
            ))}

            {/* Show message when empty and not dragging */}
            {blocks.length === 0 && !isDragging && (
                <div className="empty-dropzone-message">
                    Drop blocks here
                </div>
            )}
        </div>
    );
};

export default DropZone;
