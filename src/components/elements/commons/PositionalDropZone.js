import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../../../contexts/BuilderContext';
import { ItemTypes } from '../../../utils/DragTypes';

const PositionalDropZone = ({ parentId, index, position = 'between' }) => {
    const { createElement, moveElement, getElements, isDragging } = useBuilder();
    const dropZoneRef = useRef(null);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: [ItemTypes.TEXT, ItemTypes.IMAGE, ItemTypes.FLEXBOX, ItemTypes.COLUMN, ItemTypes.CONTAINER_ITEM],
        drop: (item, monitor) => {
            // Prevent dropping if this is a child of the event path (prevents duplicate drops)
            if (monitor.didDrop()) {
                return;
            }

            // If it's a new element, create it at the specified index
            if (!item.id) {
                console.log("Creating new element:", item.type, "in parent:", parentId, "at index:", index);
                createElement(item.type, parentId, {}, index);
            }
            // If it's an existing element being moved
            else if (item.id) {
                console.log("Moving element:", item.id, "to parent:", parentId, "at index:", index);

                // Prevent dropping into itself or same position
                if (item.id && item.parentId === parentId) {
                    const currentChildren = getElements(parentId);
                    const currentIndex = currentChildren.findIndex(el => el.id === item.id);
                    // Don't move if it's the same position or adjacent position (which would be the same result)
                    if (currentIndex === index || currentIndex === index - 1) {
                        return;
                    }
                }

                // Move the element to the specified position
                moveElement(item.id, parentId, index);
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
