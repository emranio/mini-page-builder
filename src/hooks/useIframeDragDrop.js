import { useEffect } from 'react';
import { useBuilder } from '../contexts/BuilderContext';

/**
 * Hook to handle drag and drop communication between iframe and parent window
 * Also handles element selection and settings communication
 * 
 * @returns {object} Hook methods and state
 */
const useIframeDragDrop = () => {
    const { createElement, setSelectedElementId, isDragging } = useBuilder();

    // Set up event listener for messages from iframe
    useEffect(() => {
        const handleMessage = (event) => {
            if (!event.data || !event.data.type) return;

            switch (event.data.type) {
                case 'CREATE_ELEMENT': {
                    const { elementType, parentId, index } = event.data;
                    console.log('Message received from iframe:', { elementType, parentId, index });
                    createElement(elementType, parentId, {}, index);
                    break;
                }

                case 'SELECT_ELEMENT': {
                    const { elementId } = event.data;
                    console.log('Element selected in iframe:', elementId);
                    setSelectedElementId(elementId);
                    break;
                }

                case 'OPEN_ELEMENT_SETTINGS': {
                    const { elementId, elementType } = event.data;
                    console.log('Open settings requested for element:', elementId, elementType);
                    // Set the element as selected so settings panel opens
                    setSelectedElementId(elementId);
                    break;
                }

                default:
                    // Ignore unknown message types
                    break;
            }
        };

        // Listen for messages from iframe
        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [createElement, setSelectedElementId]);

    return { isDragging };
};

export default useIframeDragDrop;