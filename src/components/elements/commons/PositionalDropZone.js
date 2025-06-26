import React, { useRef, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../../../contexts/BuilderContext';
import { ItemTypes } from '../../../utils/DragTypes';

const PositionalDropZone = ({ parentId, index, position = 'between' }) => {
    const { createElement, moveElement, getElements, isDragging } = useBuilder();
    const dropZoneRef = useRef(null);
    const [isNativeOver, setIsNativeOver] = useState(false);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: [ItemTypes.TEXT, ItemTypes.IMAGE, ItemTypes.FLEXBOX, ItemTypes.COLUMN, ItemTypes.CONTAINER_ITEM],
        drop: (item, monitor) => {
            // Remove the didDrop check to allow drops to be processed
            handleDrop(item);
            return { dropped: true }; // Indicate successful drop
        },
        hover: (item, monitor) => {
            if (!dropZoneRef.current) return;
            // Add hover feedback without any restrictions
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver({ shallow: true }),
        }),
    }), [parentId, index]);

    const handleDrop = (item) => {
        // If it's a new element, create it at the specified index
        if (!item.id) {
            console.log("Creating new element:", item.type, "in parent:", parentId, "at index:", index);
            createElement(item.type, parentId, {}, index);
        }
        // If it's an existing element being moved
        else if (item.id) {
            console.log("Moving element:", item.id, "to parent:", parentId, "at index:", index);

            // Only check for same position if moving within same parent
            if (item.parentId === parentId) {
                const currentChildren = getElements(parentId);
                const currentIndex = currentChildren.findIndex(el => el.id === item.id);
                if (currentIndex === index || currentIndex === index - 1) {
                    return;
                }
            }

            moveElement(item.id, parentId, index);
        }
    };

    // Handle native drag events for iframe compatibility
    useEffect(() => {
        const dropZoneElement = dropZoneRef.current;
        if (!dropZoneElement) return;

        const handleNativeDragEnter = (e) => {
            e.preventDefault();
            if (isDragging) {
                setIsNativeOver(true);
            }
        };

        const handleNativeDragOver = (e) => {
            e.preventDefault();
            if (isDragging) {
                setIsNativeOver(true);
            }
        };

        const handleNativeDragLeave = (e) => {
            e.preventDefault();
            // Only set to false if we're leaving the drop zone itself
            if (e.relatedTarget && !dropZoneElement.contains(e.relatedTarget)) {
                setIsNativeOver(false);
            }
        };

        const handleNativeDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsNativeOver(false);

            // Get the dragged data
            const dragData = e.dataTransfer.getData('application/json');
            if (dragData) {
                try {
                    const item = JSON.parse(dragData);
                    handleDrop(item);

                    // Also send message to parent if we're in iframe
                    if (window.parent !== window) {
                        window.parent.postMessage({
                            type: 'CREATE_ELEMENT',
                            elementType: item.type,
                            parentId,
                            index
                        }, '*');
                    }
                } catch (err) {
                    console.error('Error processing drop:', err);
                }
            }
        };

        dropZoneElement.addEventListener('dragenter', handleNativeDragEnter);
        dropZoneElement.addEventListener('dragover', handleNativeDragOver);
        dropZoneElement.addEventListener('dragleave', handleNativeDragLeave);
        dropZoneElement.addEventListener('drop', handleNativeDrop);

        return () => {
            dropZoneElement.removeEventListener('dragenter', handleNativeDragEnter);
            dropZoneElement.removeEventListener('dragover', handleNativeDragOver);
            dropZoneElement.removeEventListener('dragleave', handleNativeDragLeave);
            dropZoneElement.removeEventListener('drop', handleNativeDrop);
        };
    }, [isDragging, parentId, index]);

    const setRefs = (el) => {
        dropZoneRef.current = el;
        drop(el);
    };

    if (!isDragging) {
        return null;
    }

    const isHovering = isOver || isNativeOver;

    return (
        <div
            ref={setRefs}
            className={`positional-drop-zone ${position} ${isHovering ? 'positional-drop-zone-hover' : ''}`}
            data-parent-id={parentId}
            data-index={index}
        />
    );
};

export default PositionalDropZone;
