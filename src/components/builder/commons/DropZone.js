import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../../../contexts/BuilderContext';
import { ItemTypes } from '../../../utils/DragTypes';
import { BlockRenderer } from './index';
import PositionalDropZone from './PositionalDropZone';

const DropZone = ({ parentId, layoutClass = 'vertical-layout' }) => {
    const { createBlock, moveBlock, getBlocks, isDragging } = useBuilder();
    const dropZoneRef = useRef(null);

    const blocks = getBlocks(parentId);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: [ItemTypes.TEXT, ItemTypes.IMAGE, ItemTypes.FLEXBOX, ItemTypes.COLUMN, ItemTypes.TABS, ItemTypes.CONTAINER_ITEM],
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
                console.log("Creating new block:", item.type, "in parent:", parentId);
                const targetChildren = getBlocks(parentId);
                createBlock(item.type, parentId, {}, targetChildren.length);
            }
            // If it's an existing block being moved, move it to the end
            else if (item.id) {
                console.log("Moving block:", item.id, "to parent:", parentId);
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
