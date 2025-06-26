import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useBuilder } from '../../../contexts/BuilderContext';
import { ItemTypes } from '../../../utils/DragTypes';
import { Button, Dropdown } from 'antd';
import { MoreOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import TextElement from '../text';
import ImageElement from '../image';
import FlexboxElement from '../flexbox';
import ColumnElement from '../column';

// Element registry for getting settings components
const elementRegistry = {
    text: TextElement,
    image: ImageElement,
    flexbox: FlexboxElement,
    column: ColumnElement
};

const DraggableElement = ({ id, type, parentId, children }) => {
    const { moveElement, deleteElement, getElements, setIsDragging, getElementById, updateElement } = useBuilder();
    const ref = useRef(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Get element data and settings component
    const element = getElementById(id);
    const elementConfig = elementRegistry[type];
    const SettingsComponent = elementConfig?.settings;

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

    // Handle settings
    const handleSettings = () => {
        setIsSettingsOpen(true);
    };

    // Throttled update for settings
    const throttledUpdate = (elementId, newProps) => {
        updateElement(elementId, newProps);
    };

    const menuItems = [
        ...(SettingsComponent ? [{
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: handleSettings
        }] : []),
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete',
            onClick: handleDelete,
            danger: true
        }
    ];

    return (
        <div
            ref={ref}
            className={`draggable-element ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-target' : ''}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className="element-actions">
                <Dropdown
                    menu={{ items: menuItems }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Button
                        type="text"
                        icon={<MoreOutlined />}
                        size="small"
                        className="element-action-button"
                    />
                </Dropdown>
            </div>
            <div className="element-wrapper">
                {children}
            </div>

            {/* Render settings modal if available */}
            {SettingsComponent && (
                <SettingsComponent
                    open={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    element={element}
                    throttledUpdate={throttledUpdate}
                />
            )}
        </div>
    );
};

export default DraggableElement;
