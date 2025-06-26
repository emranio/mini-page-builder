import React from 'react';
import { useBuilder } from '../../../contexts/BuilderContext';
import { ElementRenderer } from '../../elements/commons';
import IframeElementActions from './IframeElementActions';

/**
 * IframeDraggableElement - Wrapper for elements within iframe that provides drag/drop and actions
 * This component handles element rendering with actions within the iframe context
 */
const IframeDraggableElement = ({ element, onSettingsClick }) => {
    const { selectedElementId, setSelectedElementId } = useBuilder();
    const isSelected = selectedElementId === element.id;

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedElementId(element.id);

        // Notify parent window of selection
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'SELECT_ELEMENT',
                elementId: element.id
            }, '*');
        }
    };

    return (
        <div
            className={`iframe-draggable-element ${isSelected ? 'selected' : ''}`}
            onClick={handleClick}
            data-element-id={element.id}
            data-element-type={element.type}
        >
            <div className="element-wrapper">
                <ElementRenderer element={element} />
                <IframeElementActions
                    element={element}
                    onSettingsClick={onSettingsClick}
                />
            </div>
        </div>
    );
};

export default IframeDraggableElement;
