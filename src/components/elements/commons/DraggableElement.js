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

    // Set up the element to also accept drops for reordering
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.CONTAINER_ITEM,
        hover: (item, monitor) => {
            if (!ref.current) {
                return;
            }

            const hoverBoundingRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            const dragElement = monitor.getItem();

            // Don't do anything if we're hovering over ourselves
            if (dragElement.id === id) {
                return;
            }

            // Only proceed if we have the same parent
            if (dragElement.parentId === parentId) {
                // Find sibling elements to determine the index
                const siblingElements = getElements(parentId);

                // Get current indexes
                const dragIndex = siblingElements.findIndex(el => el.id === dragElement.id);
                const hoverIndex = siblingElements.findIndex(el => el.id === id);

                // Don't replace items with themselves
                if (dragIndex === hoverIndex) {
                    return;
                }

                // Determine direction of movement
                const isDragLowerThanHover = dragIndex > hoverIndex;

                // Only perform the move when the cursor is at the appropriate position
                if (isDragLowerThanHover && hoverClientY > hoverMiddleY) {
                    return;
                }

                if (!isDragLowerThanHover && hoverClientY < hoverMiddleY) {
                    return;
                }

                // Time to actually perform the action
                moveElement(dragElement.id, parentId, hoverIndex);

                // Update the drag item's position for better UX
                item.index = hoverIndex;
            }
        },
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
