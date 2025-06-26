import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../../../contexts/BuilderContext';
import { ItemTypes } from '../../../utils/DragTypes';

/**
 * IframeDropZone - A React DnD drop zone that covers the entire iframe area
 * This component ensures that React DnD can detect drops on the iframe
 */
const IframeDropZone = ({ children, iframeWindow, iframeDocument }) => {
    const { createElement, isDragging } = useBuilder();
    const dropRef = useRef(null);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: [ItemTypes.TEXT, ItemTypes.IMAGE, ItemTypes.FLEXBOX, ItemTypes.COLUMN, ItemTypes.CONTAINER_ITEM],
        drop: (item, monitor) => {
            // Prevent dropping if this is a child of the event path
            if (monitor.didDrop()) {
                return;
            }

            console.log('Iframe drop zone activated for item:', item);

            // Try to find the specific drop zone that was targeted
            // We'll use a more sophisticated approach to determine where to drop
            const dropResult = findDropTarget(iframeDocument, monitor.getClientOffset());

            if (dropResult) {
                const { parentId, index } = dropResult;
                console.log('Creating element in iframe:', { type: item.type, parentId, index });
                createElement(item.type, parentId, {}, index);
            } else {
                // Fallback: drop at root level
                console.log('Fallback: Creating element at root level');
                createElement(item.type, null, {}, 0);
            }

            return { dropped: true };
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver({ shallow: true }),
        }),
    }));

    // Helper function to find the best drop target based on mouse position
    const findDropTarget = (document, clientOffset) => {
        if (!clientOffset || !document) return null;

        // Convert screen coordinates to iframe coordinates
        const iframe = iframeWindow.frameElement;
        if (!iframe) return null;

        const iframeRect = iframe.getBoundingClientRect();
        const x = clientOffset.x - iframeRect.left;
        const y = clientOffset.y - iframeRect.top;

        // Find element at position within iframe
        const elementAtPoint = document.elementFromPoint(x, y);
        if (!elementAtPoint) return null;

        // Look for the closest drop zone
        const dropZone = elementAtPoint.closest('[data-parent-id]');
        if (dropZone) {
            return {
                parentId: dropZone.getAttribute('data-parent-id'),
                index: parseInt(dropZone.getAttribute('data-index') || '0', 10)
            };
        }

        return null;
    };

    const setRefs = (el) => {
        dropRef.current = el;
        drop(el);
    };

    return (
        <div
            ref={setRefs}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                backgroundColor: isOver ? 'rgba(24, 144, 255, 0.05)' : 'transparent'
            }}
        >
            {children}
        </div>
    );
};

export default IframeDropZone;
