import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Card, Group, Text } from '@mantine/core';
import { useBuilder } from '../../../../data/BuilderReducer';

const BlockItem = ({ type, icon, label }) => {
    const { setIsDragging } = useBuilder();

    // Set up the draggable element using @dnd-kit
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: `new-block-${type}`,
        data: {
            type,
            isNewBlock: true
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1
    } : {
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`block-item ${isDragging ? 'dragging' : ''}`}
            {...listeners}
            {...attributes}
        >
            <Card
                withBorder
                shadow="xs"
                className="block-card"
                style={{ cursor: 'grab', height: '100%' }}
            >
                <Group direction="column" gap="xs" align="center" style={{ textAlign: 'center' }}>
                    <div className="block-icon" style={{ fontSize: '24px', color: '#1976d2' }}>
                        {icon}
                    </div>
                    <Text size="sm" fw={500} className="block-label">
                        {label}
                    </Text>
                </Group>
            </Card>
        </div>
    );
};

export default BlockItem;
