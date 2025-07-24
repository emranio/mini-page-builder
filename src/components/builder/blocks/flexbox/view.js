import React, { useRef } from 'react';
import { useBuilder } from '../../../../contexts/BuilderReducer';
import { DropZone } from '../../commons';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const FlexboxBlockView = ({
    id,
    padding = 10,
    margin = 5,
    backgroundColor = 'transparent',
    borderStyle = 'dashed',
    borderWidth = 1,
    borderColor = '#d9d9d9',
    borderRadius = 0,
    throttledUpdate,
    blockId
}) => {
    const { createBlock, isDragging, setSelectedBlockId } = useBuilder();
    const containerRef = useRef(null);

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedBlockId(id);
    };

    // Add a new flexbox container inside this container
    const handleAddFlexbox = () => {
        createBlock('flexbox', id);
    };

    return (
        <div
            ref={containerRef}
            id={blockId}
            className={`flexbox-container ${isDragging ? 'during-drag' : ''}`}
            data-id={id}
            onClick={handleClick}
        >
            <DropZone parentId={id} />

            <Button
                icon={<PlusOutlined />}
                onClick={handleAddFlexbox}
                className="add-container-button"
                size="small"
            >
                Add Container
            </Button>
        </div>
    );
};

export default FlexboxBlockView;
