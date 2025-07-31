import React, { useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useBuilder } from '../../../data/BuilderReducer';
import blockManager from './block/blockManager';
import { ActionIcon } from '@mantine/core';
import IconTrash from '@tabler/icons-react/dist/esm/icons/IconTrash';

const Draggable = ({ id, type, parentId, children }) => {
    const { deleteBlock, setIsDragging, setDraggedBlockId } = useBuilder();
    const ref = useRef(null);

    // Get drag type constants
    const dragTypes = blockManager.getDragTypeConstants();

    // Set up the element to be draggable
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: dragTypes.CONTAINER_ITEM,
        item: () => {
            setIsDragging(true);
            setDraggedBlockId(id); // Track which block is being dragged
            return { id, type, parentId, blockType: type };
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        }),
        end: () => {
            setIsDragging(false);
            // setDraggedBlockId will be cleared in the useEffect in BuilderReducer
        }
    }));

    // Hide the default drag preview
    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    // Set up the element to also accept drops for reordering (disabled to avoid conflicts with positional drop zones)
    const [{ isOver }, drop] = useDrop(() => ({
        accept: dragTypes.CONTAINER_ITEM,
        // Removed hover logic - positioning is now handled by PositionalDropZone components
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }), [id, parentId]);

    // Initialize drag and drop refs
    drag(drop(ref));

    // Handle actions like delete
    const handleDelete = () => {
        deleteBlock(id);
    };

    return (
        <div
            ref={ref}
            className={`draggable-block ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-target' : ''}`}
        >
            <div className="block-actions">
                <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    className="block-action-button"
                    onClick={handleDelete}
                >
                    <IconTrash size={16} />
                </ActionIcon>
            </div>
            <div className="block-wrapper">
                {/* Always render the actual component, no placeholder when dragging */}
                {children}
            </div>
        </div>
    );
};

export default Draggable;
