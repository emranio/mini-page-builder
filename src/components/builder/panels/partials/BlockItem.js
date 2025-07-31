import React from 'react';
import { useDrag } from 'react-dnd';
import { Card, Text } from '@mantine/core';
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
                shadow="none"
                className="block-card"
                style={{
                    cursor: 'grab',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 8px',
                    textAlign: 'center'
                }}
            >
                <div className="block-icon" style={{
                    fontSize: '24px',
                    color: '#1976d2',
                    marginBottom: 'auto'
                }}>
                    {icon}
                </div>
                <Text size="sm" fw={500} className="block-label" style={{
                    marginTop: 'auto'
                }}>
                    {label}
                </Text>
            </Card>
        </div>
    );
};

export default BlockItem;
