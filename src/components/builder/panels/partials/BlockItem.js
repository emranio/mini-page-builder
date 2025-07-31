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
        }
    }));

    return (
        <div
            ref={drag}
            className={`block-item ${isDragging ? 'dragging' : ''}`}
            style={{
                opacity: isDragging ? 0.5 : 1,
                width: '100px',
                height: '100px',
                flexShrink: 0
            }}
        >
            <Card
                withBorder
                shadow="none"
                className="block-card"
                style={{
                    cursor: 'grab',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px',
                    textAlign: 'center'
                }}
            >
                <div className="block-icon" style={{
                    fontSize: '28px',
                    color: '#1976d2',
                    marginBottom: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1
                }}>
                    {icon}
                </div>
                <Text size="xs" fw={500} className="block-label" style={{
                    marginTop: 'auto',
                    lineHeight: '1.2',
                    fontSize: '11px'
                }}>
                    {label}
                </Text>
            </Card>
        </div>
    );
};

export default BlockItem;
