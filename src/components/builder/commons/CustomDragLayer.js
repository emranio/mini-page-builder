import React from 'react';
import { useDragLayer } from 'react-dnd';
import blockManager from './block/blockManager';

const CustomDragLayer = () => {
    const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        currentOffset: monitor.getClientOffset(),
        isDragging: monitor.isDragging(),
    }));

    if (!isDragging || !currentOffset) {
        return null;
    }

    // Get block type constants
    const dragTypes = blockManager.getDragTypeConstants();

    // Show preview for any drag operation, but customize based on type
    let icon = '📄';
    let label = 'Block';

    if (item?.type === dragTypes.CONTAINER_ITEM && item?.id) {
        // This is an existing block being reordered
        const blockType = item.blockType || item.type;
        const blockDefinition = blockManager.getBlock(blockType);

        if (blockDefinition) {
            icon = blockDefinition.icon;
            label = blockDefinition.title || blockType;
        } else {
            label = blockType;
        }
    } else if (item?.type && item.type !== dragTypes.CONTAINER_ITEM) {
        // This is a new block being dragged from the sidebar
        const blockDefinition = blockManager.getBlock(item.type);

        if (blockDefinition) {
            icon = blockDefinition.icon;
            label = blockDefinition.title || item.type;
        } else {
            label = item.type;
        }
    }

    const { x, y } = currentOffset;

    return (
        <div
            className="drag-preview-box"
            style={{
                left: x,
                top: y,
                position: 'fixed',
                width: '60px',
                height: '60px',
                background: 'white',
                border: '2px solid #1890ff',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                pointerEvents: 'none',
                opacity: 0.95,
                transform: 'translate(-50%, -50%)',
            }}
        >
            <div className="drag-preview-icon" style={{
                fontSize: '18px',
                marginBottom: '4px',
                color: '#1890ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>{icon}</div>
            <div className="drag-preview-title" style={{
                fontSize: '9px',
                fontWeight: 600,
                color: '#666',
                textAlign: 'center',
                lineHeight: 1.1,
                maxWidth: '55px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }}>{label}</div>
        </div>
    );
};

export default CustomDragLayer;
