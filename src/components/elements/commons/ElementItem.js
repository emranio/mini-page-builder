import React from 'react';
import { useDrag } from 'react-dnd';
import { Card } from 'antd';
import { useBuilder } from '../../../contexts/BuilderContext';

const ElementItem = ({ type, icon, label }) => {
    const { setIsDragging } = useBuilder();

    // Set up the drag source for React DnD
    const [{ isDragging }, drag] = useDrag(() => ({
        type,
        item: () => {
            setIsDragging(true);
            return { type };
        },
        end: (item, monitor) => {
            setIsDragging(false);
            const didDrop = monitor.didDrop();
            console.log("Drag ended. Did drop:", didDrop, "Item:", item);
        }
    }));

    // Handle native drag events
    const handleDragStart = (e) => {
        setIsDragging(true);

        // Create item data as a string
        const itemData = JSON.stringify({ type, isNew: true });

        // Set the data in multiple formats for compatibility
        e.dataTransfer.setData('text/plain', type);
        e.dataTransfer.setData('application/json', itemData); // Now properly stringified
        e.dataTransfer.setData('application/x-mini-page-builder', type);
        e.dataTransfer.effectAllowed = 'copy';

        // Debug info
        console.log('Drag started with data (stringified):', itemData);
        console.log('Drag started with type:', type);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'grab'
            }}
            draggable="true"
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <Card hoverable className="element-item">
                {icon}
                <span>{label}</span>
            </Card>
        </div>
    );
};

export default ElementItem;
