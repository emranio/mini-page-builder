import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import IframeContent from './IframeContent';
import '../../../styles/ReactIframeProxy.scss';

/**
 * ReactIframeProxy - A real iframe component using react-frame-component
 * This provides a true iframe with isolated CSS context for responsive design testing
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
                        border: 'none'
                    }}
                    head={[
                        // Add antd styles from CDN
                        <link
                            key="antd-css"
                            rel="stylesheet"
                            href="https://cdn.jsdelivr.net/npm/antd@5.26.2/dist/reset.css"
                        />,
                        // Add meta viewport for responsive design
                        <meta
                            key="viewport"
                            name="viewport"
                            content="width=device-width, initial-scale=1.0"
                        />
                    ]}
                >
                    <FrameContextConsumer>
                        {(frameContext) => (
                            <IframeContent frameContext={frameContext}>
                                {children}
                            </IframeContent>
                        )}
                    </FrameContextConsumer>
                </Frame>
            </div>
        </div>
    );
};

ReactIframeProxy.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
};

export default ReactIframeProxy;
