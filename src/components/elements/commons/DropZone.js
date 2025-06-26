import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../../../contexts/BuilderContext';
import { ItemTypes } from '../../../utils/DragTypes';
import { ElementRenderer } from './index';

const DropZone = ({ parentId }) => {
    const { createElement, moveElement, getElements, isDragging } = useBuilder();
    const dropZoneRef = useRef(null);

    const elements = getElements(parentId);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: [ItemTypes.TEXT, ItemTypes.IMAGE, ItemTypes.FLEXBOX, ItemTypes.COLUMN, ItemTypes.CONTAINER_ITEM],
        drop: (item, monitor) => {
            // Prevent dropping if this is a child of the event path (prevents duplicate drops)
            if (monitor.didDrop()) {
                return;
            }

            // Prevent dropping into itself if it's already a container item
            if (item.id && item.parentId === parentId) {
                return;
            }

            // If it's a new element, create it
            if (!item.id) {
                console.log("Creating new element:", item.type, "in parent:", parentId);
                createElement(item.type, parentId);
            }
            // If it's an existing element being moved
            else if (item.id) {
                console.log("Moving element:", item.id, "to parent:", parentId);
                // Get the children of the target parent to determine the index
                const targetChildren = getElements(parentId);
                // Add to the end by default
                const index = targetChildren.length;
                // Move the element to its new parent
                moveElement(item.id, parentId, index);
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
            {elements.map((element) => (
                <ElementRenderer
                    key={element.id}
                    element={element}
                />
            ))}
        </div>
    );
};

export default DropZone;
