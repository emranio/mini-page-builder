import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useBuilder } from '../../../data/BuilderReducer';
import { ActionIcon } from '@mantine/core';
import IconTrash from '@tabler/icons-react/dist/esm/icons/IconTrash';

const Draggable = ({ id, type, parentId, children }) => {
    const { deleteBlock, setIsDragging, setDraggedBlockId } = useBuilder();

    // Set up the element to be draggable
    const {
        attributes,
        listeners,
        setNodeRef: setDragNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: `block-${id}`,
        data: {
            blockId: id,
            type,
            parentId
        }
    });

    // Set up the element to also accept drops (for nested containers)
    const {
        setNodeRef: setDropNodeRef,
        isOver
    } = useDroppable({
        id: `drop-${id}`,
        data: {
            blockId: id,
            parentId: id, // This block becomes the parent for dropped items
            index: 0 // Default to first position
        }
    });

    // Combine refs
    const setNodeRef = (node) => {
        setDragNodeRef(node);
        setDropNodeRef(node);
    };

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1
    } : {
        opacity: isDragging ? 0.5 : 1
    };

    // Handle actions like delete
    const handleDelete = () => {
        deleteBlock(id);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`draggable-block ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-target' : ''}`}
        >
            <div
                className="block-actions"
                {...listeners}
                {...attributes}
                style={{ cursor: 'grab' }}
            >
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
                {/* When dragging, render a simplified placeholder instead of the full component */}
                {isDragging ? (
                    <div className="block-placeholder">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Block
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default Draggable;
