import React from 'react';
import { useDrag } from 'react-dnd';
import { Card } from 'antd';
import { useBuilder } from '../../../contexts/BuilderContext';

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
            const didDrop = monitor.didDrop();
        }
    }));

    return (
        <div
            ref={drag}
            className={`block-item ${isDragging ? 'dragging' : ''}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <Card
                hoverable
                className="block-card"
                size="small"
            >
                <div className="block-content">
                    <div className="block-icon">{icon}</div>
                    <div className="block-label">{label}</div>
                </div>
            </Card>
        </div>
    );
};

export default BlockItem;
