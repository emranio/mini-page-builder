import React from 'react';
import { Image } from 'antd';
import { useBuilder } from '../../../../contexts/BuilderReducer';

const ImageBlockView = ({
    id,
    src = 'https://placehold.co/200x50?text=click+to+edit&font=roboto',
    alt = 'Image',
    width = '100%',
    height = 'auto',
    borderRadius = 0,
    throttledUpdate,
    blockId
}) => {
    const { setSelectedBlockId } = useBuilder();

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedBlockId(id);
    };

    return (
        <Image
            id={blockId}
            src={src}
            alt={alt}
            preview={false}
            width="100%"
            className="newsletter-image"
            onClick={handleClick}
        />
    );
};

export default ImageBlockView;
