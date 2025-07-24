import React from 'react';
import { Image } from 'antd';

/**
 * ImageBlockView component - Simplified with automatic prop handling
 * All common functionality (click handlers, prop defaults, memoization) is handled by BlockFactory
 */
const ImageBlockView = ({
    src,
    alt,
    width,
    height,
    borderRadius,
    uniqueBlockId,
    onClick
}) => {
    const imageStyle = React.useMemo(() => ({
        width,
        height,
        borderRadius: `${borderRadius}px`,
        cursor: 'pointer'
    }), [width, height, borderRadius]);

    return (
        <div id={uniqueBlockId} className="image-block" onClick={onClick}>
            <div className="image-container">
                <Image
                    src={src}
                    alt={alt}
                    preview={false}
                    style={imageStyle}
                    className="newsletter-image"
                />
            </div>
        </div>
    );
};

export default ImageBlockView;
