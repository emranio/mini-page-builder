import React, { useEffect } from 'react';
import IframeDropZone from './IframeDropZone';

/**
 * IframeContent - Component to handle content inside the iframe
 * This component properly handles the useEffect for style injection
 */
const IframeContent = ({ frameContext, children }) => {
    // Function to inject all element styles into iframe
    const injectStyles = (frameDocument) => {
        if (!frameDocument) return;

        // Check if styles are already injected
        if (frameDocument.getElementById('iframe-element-styles')) {
            return;
        }

        // Create a style element for our custom styles
        const styleElement = frameDocument.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'iframe-element-styles';

        // Add all our compiled SCSS styles
        const customStyles = `
            /* Base iframe styles */
            body {
                margin: 0;
                padding: 16px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                    sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                box-sizing: border-box;
                background-color: #fff;
                color: #333;
                line-height: 1.6;
            }

            *, *::before, *::after {
                box-sizing: inherit;
            }

            /* Text Element Styles */
            .text-element {
                padding: 12px;
                margin: 8px 0;
                min-height: 32px;
                line-height: 1.6;
                outline: none;
                border: 1px solid transparent;
                border-radius: 6px;
                transition: all 0.2s ease;
                background-color: transparent;
                font-size: 14px;
                color: #333;
                cursor: text;
            }
            
            .text-element:hover {
                border-color: #e6e6e6;
                background-color: #fafafa;
            }

            .text-element:focus {
                border-color: #1890ff;
                box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
                background-color: #fff;
            }

            /* Flexbox Element Styles */
            .flexbox-element {
                display: flex;
                min-height: 80px;
                padding: 16px;
                margin: 8px 0;
                border: 2px dashed #e6e6e6;
                border-radius: 8px;
                transition: all 0.2s ease;
                position: relative;
                background-color: #fafafa;
            }
            
            .flexbox-element:hover {
                border-color: #1890ff;
                background-color: rgba(24, 144, 255, 0.03);
                box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
            }

            /* Image Element Styles */
            .image-element {
                margin: 8px 0;
                position: relative;
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid transparent;
                transition: all 0.2s ease;
            }
            
            .image-element img {
                max-width: 100%;
                height: auto;
                display: block;
                border-radius: inherit;
            }

            /* Column Element Styles */
            .column-element {
                display: flex;
                flex-direction: column;
                min-height: 80px;
                padding: 16px;
                margin: 4px;
                border: 2px dashed #e6e6e6;
                border-radius: 8px;
                transition: all 0.2s ease;
                position: relative;
                background-color: #fafafa;
                flex: 1;
            }
            
            .column-element:hover {
                border-color: #1890ff;
                background-color: rgba(24, 144, 255, 0.03);
                box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
            }

            /* Drop Zone Styles */
            .drop-zone {
                min-height: 60px;
                margin: 8px 0;
                border: 2px dashed #d9d9d9;
                border-radius: 6px;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: #fafafa;
                position: relative;
            }
            
            .drop-zone.drop-zone-hover,
            .drop-zone.drag-over {
                border-color: #1890ff;
                background-color: #e6f7ff;
                transform: scale(1.02);
            }

            /* Positional Drop Zones */
            .positional-drop-zone {
                height: 3px;
                width: 100%;
                background-color: transparent;
                border: none;
                transition: all 0.2s ease;
                margin: 2px 0;
                padding: 0;
                position: relative;
                z-index: 10;
                border-radius: 2px;
            }

            .positional-drop-zone.positional-drop-zone-hover {
                height: 6px;
                background-color: #1890ff;
                box-shadow: 0 0 8px rgba(24, 144, 255, 0.5);
            }

            /* Element actions */
            .element-actions {
                position: absolute;
                top: -20px;
                right: 0;
                opacity: 0;
                transition: opacity 0.2s ease;
                display: flex;
                gap: 4px;
                z-index: 100;
            }

            .element-wrapper:hover .element-actions {
                opacity: 1;
            }

            /* Dragging states */
            body.dragging .positional-drop-zone {
                display: block;
            }

            body:not(.dragging) .positional-drop-zone {
                display: none;
            }
        `;

        styleElement.textContent = customStyles;
        frameDocument.head.appendChild(styleElement);

        // Add meta viewport for responsive design if not already present
        if (!frameDocument.querySelector('meta[name="viewport"]')) {
            const meta = frameDocument.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0';
            frameDocument.head.appendChild(meta);
        }
    };

    // Inject styles when frame context is available
    useEffect(() => {
        if (frameContext && frameContext.document) {
            injectStyles(frameContext.document);
        }
    }, [frameContext]);

    if (!frameContext) {
        return null;
    }

    return (
        <IframeDropZone document={frameContext.document} window={frameContext.window}>
            {children}
        </IframeDropZone>
    );
};

export default IframeContent;
