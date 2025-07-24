import React from 'react';
import { Image } from 'antd';
import { withBaseBlock } from '../../commons/base';
import { useBuilder } from '../../../../contexts/BuilderReducer';
import StyleInjector from '../../commons/StyleInjector';
import { generateImageStyles } from './style';

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

    // Generate unique block ID and styles
    const blockId = `image-${id}`;
    const dynamicCSS = generateImageStyles(id, { width, height, borderRadius });

    return (
        <>
            <StyleInjector id={blockId} css={dynamicCSS} />
            <Image
                id={blockId}
                src={src}
                alt={alt}
                preview={false}
                width="100%"
                className="newsletter-image"
                onClick={handleClick}
            />
        </>
    );
};

export default withBaseBlock(ImageBlockView);
