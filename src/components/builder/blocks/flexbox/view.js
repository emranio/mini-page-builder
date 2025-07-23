import React, { useRef } from 'react';
import { useBuilder } from '../../../../contexts/BuilderContext';
import { DropZone } from '../commons';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { withBaseBlock } from '../base';

const FlexboxBlockView = ({
    id,
    padding = 10,
    margin = 5,
    backgroundColor = 'transparent',
    borderStyle = 'dashed',
    borderWidth = 1,
    borderColor = '#d9d9d9',
    borderRadius = 0,
    throttledUpdate
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

    const containerStyle = {
        width: '100%',
        padding: `${padding}px`,
        margin: `${margin}px 0`,
        backgroundColor: backgroundColor === 'transparent' ? 'rgba(0, 0, 0, 0.02)' : backgroundColor,
        border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        borderRadius: `${borderRadius}px`,
        position: 'relative',
        boxSizing: 'border-box',
        transition: 'all 0.2s ease'
    };

    return (
        <div
            ref={containerRef}
            className={`flexbox-container ${isDragging ? 'during-drag' : ''}`}
            data-id={id}
            style={containerStyle}
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

export default withBaseBlock(FlexboxBlockView);
