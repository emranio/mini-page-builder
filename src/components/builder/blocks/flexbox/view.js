import React, { useRef } from 'react';
import { useBuilder } from '../../../../contexts/BuilderReducer';
import { DropZone } from '../../commons';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { withBaseBlock } from '../../commons/base';
import StyleInjector from '../../commons/StyleInjector';
import { generateFlexboxStyles } from './style';

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

    // Generate unique block ID and styles
    const blockId = `flexbox-${id}`;
    const dynamicCSS = generateFlexboxStyles(id, {
        padding,
        margin,
        backgroundColor,
        borderStyle,
        borderWidth,
        borderColor,
        borderRadius
    });

    return (
        <>
            <StyleInjector id={blockId} css={dynamicCSS} />
            <div
                ref={containerRef}
                id={blockId}
                className={`flexbox-container ${isDragging ? 'during-drag' : ''}`}
                data-id={id}
                onClick={handleClick}
            >
                <DropZone parentId={id} />
            </div>
        </>
    );
};

export default withBaseBlock(FlexboxBlockView);
