import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useBuilder } from '../../../contexts/BuilderContext';
import { ItemTypes } from '../../../utils/DragTypes';
import { Button } from 'antd';
import { DeleteOutlined, DragOutlined } from '@ant-design/icons';

const DraggableElement = ({ id, type, parentId, children }) => {
    const { moveElement, deleteElement, getElements, setIsDragging, setDraggedElementId } = useBuilder();
    const ref = useRef(null);

    // Set up the element to be draggable
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.CONTAINER_ITEM,
        item: () => {
            setIsDragging(true);
            setDraggedElementId(id); // Track which element is being dragged
            return { id, type, parentId };
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        }),
        end: () => {
            setIsDragging(false);
            // setDraggedElementId will be cleared in the useEffect in BuilderContext
        }
    }));

    // Set up the element to also accept drops for reordering (disabled to avoid conflicts with positional drop zones)
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.CONTAINER_ITEM,
        // Removed hover logic - positioning is now handled by PositionalDropZone components
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }), [id, parentId]);

    // Initialize drag and drop refs
    drag(drop(ref));

    // Handle actions like delete
    const handleDelete = () => {
        deleteElement(id);
    };

    return (
        <div
            ref={ref}
            className={`draggable-element ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-target' : ''}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className="element-actions">
                <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    size="small"
                    className="element-action-button"
                    onClick={handleDelete}
                    danger
                />
            </div>
            <div className="element-wrapper">
                {/* When dragging, render a simplified placeholder instead of the full component */}
                {isDragging ? (
                    <div className="element-placeholder">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Element
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default DraggableElement;
