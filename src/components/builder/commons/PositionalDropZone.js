import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../../../data/BuilderReducer';
import blockManager from './block/blockManager';

const PositionalDropZone = ({ parentId, index, position = 'between' }) => {
    const { createBlock, moveBlock, getBlocks, isDragging } = useBuilder();
    const dropZoneRef = useRef(null);

    // Get all drag types from block manager
    const acceptedTypes = blockManager.getDragTypes();

    const [{ isOver }, drop] = useDrop(() => ({
        accept: acceptedTypes,
        drop: (item, monitor) => {
            // Prevent dropping if this is a child of the event path (prevents duplicate drops)
            if (monitor.didDrop()) {
                return;
            }

            // If it's a new block, create it at the specified index
            if (!item.id) {
                createBlock(item.type, parentId, {}, index);
            }
            // If it's an existing block being moved
            else if (item.id) {

                // Prevent dropping into itself or same position
                if (item.id && item.parentId === parentId) {
                    const currentChildren = getBlocks(parentId);
                    const currentIndex = currentChildren.findIndex(bl => bl.id === item.id);
                    // Don't move if it's the same position or adjacent position (which would be the same result)
                    if (currentIndex === index || currentIndex === index - 1) {
                        // return;
                    }
                }

                // Move the block to the specified position
                moveBlock(item.id, parentId, index);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver({ shallow: true }),
        }),
    }), [parentId, index]);

    const setRefs = (el) => {
        dropZoneRef.current = el;
        drop(el);
    };

    // Don't render if not dragging to avoid taking up space
    if (!isDragging) {
        return null;
    }

    return (
        <div
            ref={setRefs}
            className={`positional-drop-zone ${position} ${isOver ? 'positional-drop-zone-hover' : ''}`}
            data-parent-id={parentId}
            data-index={index}
        />
    );
};

export default PositionalDropZone;
