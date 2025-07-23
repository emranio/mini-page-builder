import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../../../../contexts/BuilderContext';
import { ItemTypes } from '../../../../utils/DragTypes';
import { ElementRenderer } from './index';
import PositionalDropZone from './PositionalDropZone';

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

            // If it's a new element, create it at the end (fallback for direct drops on container)
            if (!item.id) {
                console.log("Creating new element:", item.type, "in parent:", parentId);
                const targetChildren = getElements(parentId);
                createElement(item.type, parentId, {}, targetChildren.length);
            }
            // If it's an existing element being moved, move it to the end
            else if (item.id) {
                console.log("Moving element:", item.id, "to parent:", parentId);
                const targetChildren = getElements(parentId);
                moveElement(item.id, parentId, targetChildren.length);
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

            {elements.map((element, index) => (
                <React.Fragment key={element.id}>
                    <ElementRenderer element={element} />
                    {/* Drop zone after each element */}
                    <PositionalDropZone parentId={parentId} index={index + 1} position="between" />
                </React.Fragment>
            ))}
        </div>
    );
};

export default DropZone;
