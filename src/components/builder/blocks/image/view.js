import React, { memo, useCallback } from 'react';
import { Image } from 'antd';
import { withBaseBlock } from '../../commons/block';
import { useBuilder } from '../../../../data/BuilderReducer';

/**
 * ImageBlockView component - Optimized with React.memo for performance
 */
const ImageBlockView = memo(({
    id,
    src = 'https://placehold.co/200x50?text=click+to+edit&font=roboto',
    alt = 'Image',
    width = '100%',
    height = 'auto',
    borderRadius = 0,
    throttledUpdate,
    uniqueBlockId
}) => {
    const { setSelectedBlockId } = useBuilder();

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        setSelectedBlockId(id);
    }, [id, setSelectedBlockId]);

    const imageStyle = React.useMemo(() => ({
        width,
        height,
        borderRadius: `${borderRadius}px`,
        cursor: 'pointer'
    }), [width, height, borderRadius]);

    return (
        <div id={uniqueBlockId} className="image-block" onClick={handleClick}>
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
});

export default withBaseBlock(ImageBlockView, 'image');
