import React from 'react';
import TextBlock from '../text';
import ImageBlock from '../image';
import FlexboxBlock from '../flexbox';
import ColumnBlock from '../column';
import TabsBlock from '../tabs';
import { ItemTypes } from '../../../../utils/DragTypes';
import DraggableElement from './DraggableElement';
import { useBuilder } from '../../../../contexts/BuilderContext';

const BlockRenderer = ({ element }) => {
    const { isDragging } = useBuilder();

    if (!element) return null;

    // Force remount key to ensure component updates properly
    const blockKey = `${element.id}-${JSON.stringify(element.props)}`;

    // Wrap the block content in a draggable wrapper
    const renderBlockContent = () => {
        // Only log when not dragging to avoid performance issues
        if (!isDragging) {
            console.log(`Rendering block ${element.id} with props:`, element.props);
        }

        switch (element.type) {
            case ItemTypes.TEXT:
                const TextComponent = TextBlock.view;
                return <TextComponent key={blockKey} id={element.id} {...element.props} />;
            case ItemTypes.IMAGE:
                const ImageComponent = ImageBlock.view;
                return <ImageComponent key={blockKey} id={element.id} {...element.props} />;
            case ItemTypes.FLEXBOX:
                const FlexboxComponent = FlexboxBlock.view;
                return <FlexboxComponent key={blockKey} id={element.id} {...element.props} />;
            case ItemTypes.COLUMN:
                const ColumnComponent = ColumnBlock.view;
                return <ColumnComponent key={blockKey} id={element.id} {...element.props} />;
            case ItemTypes.TABS:
                const TabsComponent = TabsBlock.view;
                return <TabsComponent key={blockKey} id={element.id} {...element.props} />;
            default:
                return <div>Unknown Block Type</div>;
        }
    };

    return (
        <DraggableElement
            id={element.id}
            type={element.type}
            parentId={element.parentId}
        >
            {renderBlockContent()}
        </DraggableElement>
    );
};

export default BlockRenderer;
