import React from 'react';
import { useBuilder } from '../../contexts/BuilderContext';
import TextElement from '../elements/TextElement';
import ImageElement from '../elements/ImageElement';
import FlexboxContainer from '../containers/FlexboxContainer';
import ColumnElement from '../elements/ColumnElement';
import { ItemTypes } from '../../utils/DragTypes';
import DraggableElement from '../containers/DraggableElement';

const ElementRenderer = ({ element }) => {
    const { getElementById } = useBuilder();

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
