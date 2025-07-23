import React from 'react';
import { useDrag } from 'react-dnd';
import { Card } from 'antd';
import { useBuilder } from '../../../../contexts/BuilderContext';

const ElementItem = ({ type, icon, label }) => {
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
            console.log("Drag ended. Did drop:", didDrop, "Item:", item);
            if (!didDrop) {
                console.log("Item was not dropped on a target");
            }
        }
    }));

    return (
        <div
            ref={drag}
            className={`element-item ${isDragging ? 'dragging' : ''}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <Card
                hoverable
                className="element-card"
                size="small"
            >
                <div className="element-content">
                    <div className="element-icon">{icon}</div>
                    <div className="element-label">{label}</div>
                </div>
            </Card>
        </div>
    );
};

export default ElementItem;
