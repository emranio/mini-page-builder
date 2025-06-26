import React from 'react';
import PropTypes from 'prop-types';
import '../../../styles/ReactIframeProxy.scss';

/**
 * ReactIframeProxy - A component that visually mimics an iframe but uses regular React components
 * This gives the visual appearance and behavior of an iframe without the limitations of actual iframes
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Content to render inside the iframe-like container
 * @param {string} props.title - Title attribute for accessibility
 * @param {string} props.className - Additional CSS class names
 * @param {object} props.style - Additional inline styles
 * @returns {React.ReactElement} The iframe-like container with content
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
                {children}
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
