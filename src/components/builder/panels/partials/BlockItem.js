import React from 'react';
import { useDrag } from 'react-dnd';
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
            <div
                hoverable
                className="block-card"
                size="small"
            >
                <div className="block-content">
                    <div className="block-icon">{icon}</div>
                    <div className="block-label">{label}</div>
                </div>
            </div>
        </div>
    );
};

export default BlockItem;
