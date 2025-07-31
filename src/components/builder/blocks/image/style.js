/**
 * Image Block Styles - Updated for new structure with wrapper in BlockFactory
 * Targets the fildora-builder-image-block class instead of unique ID
 */

const ImageBlockStyles = (props, uniqueId) => {
    const {
        width = '100%',
        height = 'auto',
        borderRadius = 0
    } = props;

    return `
        /* Common styles for all image blocks */
        .fildora-builder-image-block {
            cursor: pointer;
            display: block;
            transition: all 0.2s ease;
        }

        .fildora-builder-image-block:hover {
        }

        .fildora-builder-image-block .newsletter-image:hover {
        }

        .fildora-builder-image-block .ant-image {
            width: 100%;
        }

        /* Instance-specific styles using unique ID */
        #${uniqueId} .newsletter-image {
            width: ${width};
            height: ${height};
            border-radius: ${borderRadius}px;
            max-width: 100%;
            object-fit: cover;
            transition: all 0.2s ease;
        }

        #${uniqueId} .ant-image-img {
            width: ${width};
            height: ${height};
            border-radius: ${borderRadius}px;
            object-fit: cover;
        }
    `;
};

export default ImageBlockStyles;
