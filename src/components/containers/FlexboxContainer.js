import React, { useRef } from 'react';
import { useBuilder } from '../../contexts/BuilderContext';
import DropZone from './DropZone';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const FlexboxContainer = ({ id }) => {
    const { createElement } = useBuilder();
    const containerRef = useRef(null);

    // Add a new flexbox container inside this container
    const handleAddFlexbox = () => {
        // Get the drop zone containing the current container's children
        const dropZone = containerRef.current.querySelector('.flexbox-content > .drop-zone');
        if (!dropZone) return;

        // Create a new flexbox container
        createElement('flexbox', id);
    };

    // Get the global drag state to know if we're in a drag operation
    const { isDragging } = useBuilder();

    return (
        <div
            ref={containerRef}
            className={`flexbox-container ${isDragging ? 'during-drag' : ''}`}
            data-id={id}
            style={{ width: '100%' }}
        >
            {/* Use dedicated DropZone for container contents */}
            <div className="flexbox-content">
                <DropZone parentId={id} />
            </div>
            <div className="container-actions">
                <Button
                    icon={<PlusOutlined />}
                    onClick={handleAddFlexbox}
                    className="add-container-button"
                    size="small"
                >
                    Add Container
                </Button>
            </div>
        </div>
    );
};

export default FlexboxContainer;
