import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useBuilder } from '../../../contexts/BuilderContext';
import { ItemTypes } from '../../../utils/DragTypes';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const DraggableElement = ({ id, type, parentId, children }) => {
    const { moveElement, deleteElement, getElements, setIsDragging } = useBuilder();
    const ref = useRef(null);

    // Set up the element to be draggable
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.CONTAINER_ITEM,
        item: () => {
            setIsDragging(true);
            return { id, type, parentId };
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        }),
        end: () => {
            setIsDragging(false);
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
                {children}
            </div>
        </div>
    );
};

export default DraggableElement;
