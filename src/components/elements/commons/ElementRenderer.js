import React from 'react';
import TextElement from '../text';
import ImageElement from '../image';
import FlexboxContainer from '../flexbox';
import { ColumnElement } from '../column';
import { ItemTypes } from '../../../utils/DragTypes';
import DraggableElement from './DraggableElement';

const ElementRenderer = ({ element }) => {
    if (!element) return null;

    // Wrap the element content in a draggable wrapper
    const renderElementContent = () => {
        switch (element.type) {
            case ItemTypes.TEXT:
                return <TextElement id={element.id} {...element.props} />;
            case ItemTypes.IMAGE:
                return <ImageElement id={element.id} {...element.props} />;
            case ItemTypes.FLEXBOX:
                return <FlexboxContainer id={element.id} />;
            case ItemTypes.COLUMN:
                return <ColumnElement id={element.id} {...element.props} />;
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
