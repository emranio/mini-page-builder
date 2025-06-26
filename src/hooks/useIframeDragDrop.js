import { useEffect } from 'react';
import { useBuilder } from '../contexts/BuilderContext';

/**
 * Hook to handle drag and drop communication between iframe and parent window
 * 
 * @returns {object} Hook methods and state
 */
const useIframeDragDrop = () => {
    const { createElement, isDragging } = useBuilder();

    // Set up event listener for messages from iframe
    useEffect(() => {
        const handleMessage = (event) => {
            // Only process CREATE_ELEMENT messages
            if (event.data && event.data.type === 'CREATE_ELEMENT') {
                const { elementType, parentId, index } = event.data;

                console.log('Message received from iframe:', { elementType, parentId, index });

                // Create the element in the correct position
                createElement(elementType, parentId, {}, index);
            }
        };

        // Listen for messages from iframe
        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [createElement]);

    return { isDragging };
};

export default useIframeDragDrop;