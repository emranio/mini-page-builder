import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * IframeDropHandler - Component that handles native drag and drop events in the iframe
 * 
 * This component sets up native drag and drop event handlers on the iframe document
 * to enable dropping elements from the left panel into the iframe preview area.
 * It communicates with the parent window via postMessage when drops occur.
 * 
 * @param {object} props - Component props
 * @param {Window} props.iframeWindow - The iframe's window object
 * @param {Document} props.iframeDocument - The iframe's document object
 * @returns {null} - This component doesn't render anything visible
 */
const IframeDropHandler = ({ iframeWindow, iframeDocument }) => {
    useEffect(() => {
        if (!iframeWindow || !iframeDocument) return;

        const handleDragOver = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        };

        const handleDrop = (e) => {
            e.preventDefault();

            // Find the drop target element with data attributes
            const dropZone = e.target.closest('[data-parent-id]');
            if (!dropZone) return;

            const parentId = dropZone.getAttribute('data-parent-id');
            const index = parseInt(dropZone.getAttribute('data-index') || '0', 10);

            // Get the element type from dataTransfer
            let elementType = null;
            try {
                const jsonData = e.dataTransfer.getData('application/json');
                if (jsonData) {
                    const dragData = JSON.parse(jsonData);
                    elementType = dragData.type;
                }
            } catch (error) {
                console.error('Error parsing JSON drag data:', error);
            }

            // Fallback: try to get element type from other data transfer formats
            if (!elementType) {
                for (const type of e.dataTransfer.types) {
                    if (type.startsWith('application/x-')) {
                        elementType = type.replace('application/x-', '');
                        break;
                    }
                }
            }

            if (!elementType) {
                console.warn('No element type found in drag data');
                return;
            }

            // Send message to parent window to create the element
            iframeWindow.parent.postMessage({
                type: 'CREATE_ELEMENT',
                elementType,
                parentId,
                index
            }, '*');

            console.log('Drop processed:', { elementType, parentId, index });
        };

        // Add event listeners to the iframe document
        iframeDocument.addEventListener('dragover', handleDragOver);
        iframeDocument.addEventListener('drop', handleDrop);

        // Clean up event listeners when component unmounts
        return () => {
            iframeDocument.removeEventListener('dragover', handleDragOver);
            iframeDocument.removeEventListener('drop', handleDrop);
        };
    }, [iframeWindow, iframeDocument]);

    // This component doesn't render anything visible
    return null;
};

IframeDropHandler.propTypes = {
    iframeWindow: PropTypes.object,
    iframeDocument: PropTypes.object
};

export default IframeDropHandler;