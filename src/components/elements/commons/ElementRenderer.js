import React from 'react';
import TextElement from '../text';
import ImageElement from '../image';
import FlexboxElement from '../flexbox';
import ColumnElement from '../column';
import { ItemTypes } from '../../../utils/DragTypes';
import DraggableElement from './DraggableElement';

const ElementRenderer = ({ element }) => {
    if (!element) return null;

    // Wrap the element content in a draggable wrapper
    const renderElementContent = () => {
        switch (element.type) {
            case ItemTypes.TEXT:
                const TextComponent = TextElement.view;
                return <TextComponent id={element.id} {...element.props} />;
            case ItemTypes.IMAGE:
                const ImageComponent = ImageElement.view;
                return <ImageComponent id={element.id} {...element.props} />;
            case ItemTypes.FLEXBOX:
                const FlexboxComponent = FlexboxElement.view;
                return <FlexboxComponent id={element.id} {...element.props} />;
            case ItemTypes.COLUMN:
                const ColumnComponent = ColumnElement.view;
                return <ColumnComponent id={element.id} {...element.props} />;
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
