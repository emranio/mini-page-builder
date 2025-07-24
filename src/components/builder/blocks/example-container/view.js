import React, { memo, useRef, useCallback } from 'react';
import { useBuilder } from '../../../../contexts/BuilderReducer';
import { DropZone } from '../../commons';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { withBaseBlock } from '../../commons/block';

/**
 * ExampleContainerBlockView component - Optimized with React.memo for performance
 */
const ExampleContainerBlockView = memo(({
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

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        setSelectedBlockId(id);
    }, [id, setSelectedBlockId]);

    // Add a new example-container inside this container
    const handleAddContainer = useCallback(() => {
        createBlock('example-container', id);
    }, [createBlock, id]);

    const containerStyle = React.useMemo(() => ({
        padding: `${padding}px`,
        margin: `${margin}px`,
        backgroundColor,
        border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        borderRadius: `${borderRadius}px`,
        minHeight: '100px'
    }), [padding, margin, backgroundColor, borderStyle, borderWidth, borderColor, borderRadius]);

    return (
        <div
            id={uniqueBlockId}
            ref={containerRef}
            className={`example-container ${isDragging ? 'during-drag' : ''}`}
            data-id={id}
            onClick={handleClick}
            style={containerStyle}
        >
            {/* Use dedicated DropZone for container contents */}
            <div className="example-container-content">
                <DropZone parentId={id} />
            </div>

            <div className="container-actions">
                <Button
                    icon={<PlusOutlined />}
                    onClick={handleAddContainer}
                    className="add-container-button"
                    size="small"
                >
                    Add Container
                </Button>
            </div>
        </div>
    );
});

export default withBaseBlock(ExampleContainerBlockView, 'example-container');
