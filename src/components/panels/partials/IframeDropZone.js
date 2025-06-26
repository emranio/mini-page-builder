import React, { useRef, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../../../contexts/BuilderContext';
import { ItemTypes } from '../../../utils/DragTypes';
import IframeDraggableElement from './IframeDraggableElement';
import IframePositionalDropZone from './IframePositionalDropZone';

/**
 * IframeDropZone - Enhanced drop zone component that works within iframe context
 * This replaces the regular DropZone for iframe usage with proper element actions
 */
const IframeDropZone = ({ parentId, onSettingsClick }) => {
    const { createElement, moveElement, getElements, isDragging } = useBuilder();
    const dropZoneRef = useRef(null);
    const [isNativeOver, setIsNativeOver] = useState(false);

    const elements = getElements(parentId);

    const handleDrop = (item) => {
        // If it's a new element, create it at the end
        if (!item.id) {
            console.log("Creating new element:", item.type, "in parent:", parentId);
            const targetChildren = getElements(parentId);
            createElement(item.type, parentId, {}, targetChildren.length);
        }
        // If it's an existing element being moved
        else if (item.id) {
            console.log("Moving element:", item.id, "to parent:", parentId);
            const targetChildren = getElements(parentId);
            moveElement(item.id, parentId, targetChildren.length);
        }
    };

    const [{ isOver }, drop] = useDrop(() => ({
        accept: [ItemTypes.TEXT, ItemTypes.IMAGE, ItemTypes.FLEXBOX, ItemTypes.COLUMN, ItemTypes.CONTAINER_ITEM],
        drop: (item, monitor) => {
            // Only prevent dropping into itself
            if (item.id && item.parentId === parentId) {
                return;
            }

            handleDrop(item);
            return { dropped: true }; // Indicate successful drop
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver({ shallow: true }),
        }),
    }));

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
            if (!dropZoneElement.contains(e.relatedTarget)) {
                setIsNativeOver(false);
            }
        };

        const handleNativeDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsNativeOver(false);

            // Try all available formats to get the element type
            let elementType = null;
            let item = null;

            try {
                // First try custom format
                elementType = e.dataTransfer.getData('application/x-mini-page-builder');

                // Then try JSON data
                if (!elementType) {
                    const jsonData = e.dataTransfer.getData('application/json');
                    if (jsonData) {
                        const parsed = JSON.parse(jsonData);
                        elementType = parsed.type;
                    }
                }

                // Finally try plain text
                if (!elementType) {
                    elementType = e.dataTransfer.getData('text/plain');
                }

                console.log('Extracted element type:', elementType);

                if (elementType) {
                    item = { type: elementType, isNew: true };
                    console.log('Created item:', item);
                    handleDrop(item);

                    // Also send message to parent if we're in iframe
                    if (window.parent !== window) {
                        const targetChildren = getElements(parentId);
                        window.parent.postMessage({
                            type: 'CREATE_ELEMENT',
                            elementType: item.type,
                            parentId,
                            index: targetChildren.length
                        }, '*');
                    }
                } else {
                    console.warn('No valid element type found in drop data');
                }
            } catch (err) {
                console.error('Error processing drop:', err);
                // Try fallback to plain text if JSON parsing failed
                elementType = e.dataTransfer.getData('text/plain');
                if (elementType) {
                    item = { type: elementType, isNew: true };
                    console.log('Using fallback element type:', elementType);
                    handleDrop(item);
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
    }, [isDragging, parentId, handleDrop]);

    const setRefs = (el) => {
        dropZoneRef.current = el;
        drop(el);
    };

    const isHovering = isOver || isNativeOver;

    return (
        <div
            ref={setRefs}
            className={`iframe-drop-zone vertical-layout ${isHovering ? 'drop-zone-hover' : ''} ${isDragging ? 'during-drag' : ''}`}
            data-parent-id={parentId}
        >
            <IframePositionalDropZone parentId={parentId} index={0} position="top" />
            {elements.map((element, index) => (
                <React.Fragment key={element.id}>
                    <IframeDraggableElement
                        element={element}
                        onSettingsClick={onSettingsClick}
                    />
                    <IframePositionalDropZone
                        parentId={parentId}
                        index={index + 1}
                        position="between"
                    />
                </React.Fragment>
            ))}
        </div>
    );
};

export default IframeDropZone;
