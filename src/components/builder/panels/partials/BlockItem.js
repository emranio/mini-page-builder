import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, Group, Text } from '@mantine/core';
import { useBuilder } from '../../../../data/BuilderReducer';

const BlockItem = ({ type, icon, label }) => {
    const { setIsDragging } = useBuilder();

    // Set up the drag source
    const [{ isDragging }, drag] = useDrag(() => ({
        type,
        item: () => {
            setIsDragging(true);
            return { type };
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        end: (item, monitor) => {
            setIsDragging(false);
            // const didDrop = monitor.didDrop();
            // Removed unused variable
        }
    }));

    return (
        <div
            ref={drag}
            className={`block-item ${isDragging ? 'dragging' : ''}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
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
