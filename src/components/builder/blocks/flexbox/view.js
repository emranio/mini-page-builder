import React, { useRef } from 'react';
import { useBuilder } from '../../../../contexts/BuilderReducer';
import { DropZone } from '../../commons';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { withBaseBlock } from '../../commons/block';

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
    uniqueBlockId
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
            id={uniqueBlockId}
            ref={containerRef}
            className={`flexbox-container ${isDragging ? 'during-drag' : ''}`}
            data-id={id}
            onClick={handleClick}
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

export default withBaseBlock(FlexboxBlockView, 'flexbox');
