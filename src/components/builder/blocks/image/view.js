import React from 'react';
import { Image } from 'antd';
import { withBaseBlock } from '../../commons/base';
import { useBuilder } from '../../../../contexts/BuilderContext';

const ImageBlockView = ({
    id,
    src = 'https://placehold.co/200x50?text=click+to+edit&font=roboto',
    alt = 'Image',
    width = '100%',
    height = 'auto',
    borderRadius = 0,
    throttledUpdate
}) => {
    const { setSelectedBlockId } = useBuilder();

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedBlockId(id);
    };

    const imageStyle = {
        width,
        height,
        borderRadius: `${borderRadius}px`
    };

    return (
        <div className="image-block" onClick={handleClick}>
            <div className="image-container">
                <Image
                    src={src}
                    alt={alt}
                    preview={false}
                    width="100%"
                    style={imageStyle}
                    className="newsletter-image"
                />
            </div>
        </div>
    );
};

export default withBaseBlock(ImageBlockView);
