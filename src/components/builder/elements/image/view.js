import React from 'react';
import { Image } from 'antd';
import { withBaseElement } from '../base';
import { useBuilder } from '../../../../contexts/BuilderContext';

const ImageElementView = ({
    id,
    src = 'https://placehold.co/200x50?text=click+to+edit&font=roboto',
    alt = 'Image',
    width = '100%',
    height = 'auto',
    borderRadius = 0,
    throttledUpdate
}) => {
    const { setSelectedElementId } = useBuilder();

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedElementId(id);
    };

    const imageStyle = {
        width,
        height,
        borderRadius: `${borderRadius}px`
    };

    return (
        <div className="image-element" onClick={handleClick}>
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

export default withBaseElement(ImageElementView);
