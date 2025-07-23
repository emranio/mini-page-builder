import React from 'react';
import TextElement from '../text';
import ImageElement from '../image';
import FlexboxElement from '../flexbox';
import ColumnElement from '../column';
import { ItemTypes } from '../../../../utils/DragTypes';
import DraggableElement from './DraggableElement';
import { useBuilder } from '../../../../contexts/BuilderContext';

const ElementRenderer = ({ element }) => {
    const { isDragging } = useBuilder();

    if (!element) return null;

    // Force remount key to ensure component updates properly
    const elementKey = `${element.id}-${JSON.stringify(element.props)}`;

    // Wrap the element content in a draggable wrapper
    const renderElementContent = () => {
        // Only log when not dragging to avoid performance issues
        if (!isDragging) {
            console.log(`Rendering element ${element.id} with props:`, element.props);
        }

        switch (element.type) {
            case ItemTypes.TEXT:
                const TextComponent = TextElement.view;
                return <TextComponent key={elementKey} id={element.id} {...element.props} />;
            case ItemTypes.IMAGE:
                const ImageComponent = ImageElement.view;
                return <ImageComponent key={elementKey} id={element.id} {...element.props} />;
            case ItemTypes.FLEXBOX:
                const FlexboxComponent = FlexboxElement.view;
                return <FlexboxComponent key={elementKey} id={element.id} {...element.props} />;
            case ItemTypes.COLUMN:
                const ColumnComponent = ColumnElement.view;
                return <ColumnComponent key={elementKey} id={element.id} {...element.props} />;
            default:
                return <div>Unknown Element Type</div>;
        }
    };

    return (
        <DraggableElement
            id={element.id}
            type={element.type}
            parentId={element.parentId}
        >
            {renderElementContent()}
        </DraggableElement>
    );
};

export default ElementRenderer;
