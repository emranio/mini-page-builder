import React, { useEffect, useState } from 'react';
import { Empty } from 'antd';
import { useBuilder } from '../../../contexts/BuilderContext';
import useIframeDragDrop from '../../../hooks/useIframeDragDrop';
import IframeDropZone from './IframeDropZone';

/**
 * IframeContent - Component to handle content inside the iframe
 * This component properly handles the iframe content with proper SCSS imports
 */
const IframeContent = ({ frameContext, children }) => {
    const { getElements, isDragging } = useBuilder();
    const { isDragging: hookIsDragging } = useIframeDragDrop();
    const [settingsElement, setSettingsElement] = useState(null);

    const rootElements = getElements(null); // Get elements at the root level

    // Function to inject CSS styles into iframe document
    const injectIframeStyles = async (frameDocument) => {
        if (!frameDocument) return;

        // Check if styles are already injected
        if (frameDocument.getElementById('iframe-custom-styles')) {
            return;
        }

        try {
            // Create style element
            const styleElement = frameDocument.createElement('style');
            styleElement.type = 'text/css';
            styleElement.id = 'iframe-custom-styles';

            // Fetch the compiled CSS from the main document
            const mainStyleSheets = Array.from(document.styleSheets);
            let combinedCSS = '';

            // Extract our custom styles from the main document's stylesheets
            for (const styleSheet of mainStyleSheets) {
                try {
                    if (styleSheet.href && (styleSheet.href.includes('iframe-content') || styleSheet.href.includes('elements'))) {
                        // Try to access the CSS rules
                        const rules = Array.from(styleSheet.cssRules || styleSheet.rules || []);
                        combinedCSS += rules.map(rule => rule.cssText).join('\n');
                    }
                } catch (e) {
                    // Cross-origin or other access issues, skip
                    console.warn('Could not access stylesheet:', styleSheet.href);
                }
            }

            // If we couldn't extract from existing stylesheets, add our styles manually
            if (!combinedCSS) {
                combinedCSS = `
                    /* Base iframe styles */
                    body {
                        margin: 0;
                        padding: 16px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
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

                    /* Iframe canvas */
                    .iframe-canvas {
                        min-height: 600px;
                        background: #fff;
                        padding: 16px;
                        position: relative;
                        width: 100%;
                        height: 100%;
                    }

                    .iframe-canvas.canvas-during-drag {
                        border: 2px dashed #1890ff;
                        border-radius: 4px;
                        background-color: rgba(24, 144, 255, 0.02);
                    }

                    /* Empty state for iframe */
                    .iframe-empty-canvas {
                        min-height: 400px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                        color: #8c8c8c;
                        border: 2px dashed #d9d9d9;
                        border-radius: 8px;
                        background-color: #fafafa;
                        margin: 20px 0;
                    }

                    .iframe-empty-canvas .ant-empty-image {
                        margin-bottom: 16px;
                    }
                    
                    .iframe-empty-canvas .ant-empty-description {
                        font-size: 16px;
                        margin-bottom: 8px;
                    }

                    .iframe-canvas.canvas-during-drag .iframe-empty-canvas {
                        border-color: #1890ff;
                        background-color: rgba(24, 144, 255, 0.05);
                        color: #1890ff;
                    }

                    /* Iframe element actions */
                    .iframe-element-actions {
                        position: absolute;
                        top: -30px;
                        right: 8px;
                        opacity: 0;
                        transition: opacity 0.2s ease;
                        display: flex;
                        gap: 4px;
                        z-index: 100;
                        background: rgba(255, 255, 255, 0.95);
                        border-radius: 4px;
                        padding: 2px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .iframe-element-actions .action-button {
                        background: white;
                        border: 1px solid #d9d9d9;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        cursor: pointer;
                        border-radius: 2px;
                    }
                    
                    .iframe-element-actions .action-button:hover {
                        background: #f5f5f5;
                        border-color: #40a9ff;
                    }
                    
                    .iframe-element-actions .action-button.delete-button:hover {
                        background: #fff2f0;
                        border-color: #ff4d4f;
                        color: #ff4d4f;
                    }

                    /* Iframe draggable element */
                    .iframe-draggable-element {
                        position: relative;
                        margin: 4px 0;
                        border: 1px solid transparent;
                        border-radius: 4px;
                        transition: all 0.2s ease;
                    }
                    
                    .iframe-draggable-element:hover {
                        border-color: #e6e6e6;
                    }
                    
                    .iframe-draggable-element:hover .iframe-element-actions {
                        opacity: 1;
                    }
                    
                    .iframe-draggable-element.selected {
                        border-color: #1890ff;
                        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
                    }

                    /* Iframe drop zone */
                    .iframe-drop-zone {
                        min-height: 60px;
                        margin: 8px 0;
                        border: 2px dashed #d9d9d9;
                        border-radius: 6px;
                        transition: all 0.3s ease;
                        display: flex;
                        flex-direction: column;
                        background-color: #fafafa;
                        position: relative;
                    }
                    
                    .iframe-drop-zone.drop-zone-hover,
                    .iframe-drop-zone.drag-over {
                        border-color: #1890ff;
                        background-color: #e6f7ff;
                        transform: scale(1.01);
                    }

                    /* Iframe positional drop zones */
                    .iframe-positional-drop-zone {
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

                    .iframe-positional-drop-zone.positional-drop-zone-hover {
                        height: 6px;
                        background-color: #1890ff;
                        box-shadow: 0 0 8px rgba(24, 144, 255, 0.5);
                    }

                    /* Drop zone styles */
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
                `;
            }

            styleElement.textContent = combinedCSS;
            frameDocument.head.appendChild(styleElement);

            // Add meta viewport for responsive design if not already present
            if (!frameDocument.querySelector('meta[name="viewport"]')) {
                const meta = frameDocument.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, initial-scale=1.0';
                frameDocument.head.appendChild(meta);
            }

        } catch (error) {
            console.error('Error injecting iframe styles:', error);
        }
    };

    // Handle settings click
    const handleSettingsClick = (element) => {
        setSettingsElement(element);
    };

    // Listen for messages from parent window
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'CLOSE_SETTINGS') {
                setSettingsElement(null);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    if (!frameContext) {
        return null;
    }

    return (
        <div className={`iframe-canvas ${isDragging || hookIsDragging ? 'canvas-during-drag' : ''}`}>
            <IframeDropZone
                parentId={null}
                onSettingsClick={handleSettingsClick}
            />
            {rootElements.length === 0 && (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        isDragging || hookIsDragging ?
                            "Drop here to add elements" :
                            "Drag elements here to start building"
                    }
                    className="iframe-empty-canvas"
                />
            )}
            {children}
        </div>
    );
};

export default IframeContent;
