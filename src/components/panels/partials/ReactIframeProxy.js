import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import '../../../styles/ReactIframeProxy.scss';

/**
 * ReactIframeProxy - A real iframe component using react-frame-component
 * This provides a true iframe with isolated CSS context for responsive design testing
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Content to render inside the iframe
 * @param {string} props.title - Title attribute for accessibility
 * @param {string} props.className - Additional CSS class names
 * @param {object} props.style - Additional inline styles
 * @returns {React.ReactElement} The iframe container with content
 */
const ReactIframeProxy = ({
    children,
    title = 'React Iframe Proxy',
    className = '',
    style = {},
    ...rest
}) => {
    return (
        <div
            className={`react-iframe-proxy ${className}`}
            title={title}
            style={{
                border: '1px solid #e8e8e8',
                borderRadius: '4px',
                backgroundColor: '#fff',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                ...style
            }}
            {...rest}
        >
            <div className="react-iframe-proxy-header">
                <div className="browser-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                </div>
                <div className="browser-address-bar">
                    {title}
                </div>
            </div>
            <div className="react-iframe-proxy-content">
                <Frame
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        display: 'block'
                    }}
                    head={[
                        <link key="antd-css" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/antd@5.26.2/dist/reset.css" />,
                        <style key="iframe-styles" dangerouslySetInnerHTML={{
                            __html: `
                                body {
                                    margin: 0;
                                    padding: 16px;
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                                        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                                        sans-serif;
                                    -webkit-font-smoothing: antialiased;
                                    -moz-osx-font-smoothing: grayscale;
                                    background-color: #f5f5f5;
                                    min-height: calc(100vh - 32px);
                                }
                                
                                * {
                                    box-sizing: border-box;
                                }
                                
                                /* Page builder specific styles */
                                .canvas {
                                    min-height: 500px;
                                    background-color: #fff;
                                    border-radius: 8px;
                                    position: relative;
                                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                                    padding: 20px;
                                }
                                
                                .canvas-during-drag {
                                    background-color: #f0f8ff;
                                    border: 2px dashed #1890ff;
                                }
                                
                                .empty-canvas {
                                    padding: 40px;
                                    color: #8c8c8c;
                                }
                                
                                /* Element styles */
                                .element-container {
                                    position: relative;
                                    margin: 8px 0;
                                }
                                
                                .text-element {
                                    margin: 8px 0;
                                }
                                
                                .image-element {
                                    margin: 8px 0;
                                }
                                
                                .image-element img {
                                    max-width: 100%;
                                    height: auto;
                                }
                                
                                .flexbox-element {
                                    display: flex;
                                    margin: 8px 0;
                                    min-height: 50px;
                                    border: 1px dashed #d9d9d9;
                                    border-radius: 4px;
                                    padding: 8px;
                                }
                                
                                .column-element {
                                    display: flex;
                                    flex-direction: column;
                                    margin: 8px 0;
                                    min-height: 100px;
                                    border: 1px dashed #d9d9d9;
                                    border-radius: 4px;
                                    padding: 8px;
                                }
                                
                                /* Drop zone styles */
                                .drop-zone {
                                    min-height: 40px;
                                    margin: 4px 0;
                                    border: 2px dashed transparent;
                                    border-radius: 4px;
                                    transition: all 0.2s ease;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                }
                                
                                .drop-zone.drag-over {
                                    border-color: #1890ff;
                                    background-color: #f0f8ff;
                                }
                                
                                .drop-zone-indicator {
                                    color: #8c8c8c;
                                    font-size: 12px;
                                    opacity: 0;
                                    transition: opacity 0.2s ease;
                                }
                                
                                .drop-zone.drag-over .drop-zone-indicator {
                                    opacity: 1;
                                }
                                
                                /* Responsive design for mobile */
                                @media (max-width: 576px) {
                                    body {
                                        padding: 8px;
                                    }
                                    
                                    .canvas {
                                        padding: 12px;
                                        border-radius: 4px;
                                    }
                                    
                                    .flexbox-element,
                                    .column-element {
                                        padding: 4px;
                                    }
                                    
                                    .text-element {
                                        font-size: 14px;
                                    }
                                }
                                
                                /* Responsive design for tablet */
                                @media (min-width: 577px) and (max-width: 992px) {
                                    .canvas {
                                        padding: 16px;
                                    }
                                    
                                    .flexbox-element,
                                    .column-element {
                                        padding: 6px;
                                    }
                                }
                            `
                        }} />
                    ]}
                >
                    <FrameContextConsumer>
                        {({ document, window }) =>
                            ReactDOM.createPortal(
                                <div style={{ width: '100%', height: '100%' }}>
                                    {children}
                                </div>,
                                document.body
                            )
                        }
                    </FrameContextConsumer>
                </Frame>
            </div>
        </div>
    );
};

ReactIframeProxy.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
};

export default ReactIframeProxy;
