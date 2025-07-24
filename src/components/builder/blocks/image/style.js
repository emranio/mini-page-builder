/**
 * Image Block Styles
 * Generates dynamic CSS for image blocks
 */

const ImageBlockStyles = (props, uniqueId) => {
    const {
        width = '100%',
        height = 'auto',
        borderRadius = 0
    } = props;

    return `
        #${uniqueId} {
            cursor: pointer;
            display: block;
            transition: all 0.2s ease;
        }

        #${uniqueId}:hover {
            outline: 1px dashed rgba(24, 144, 255, 0.5);
            outline-offset: 2px;
        }

        #${uniqueId} .image-container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #${uniqueId} .newsletter-image {
            width: ${width};
            height: ${height};
            border-radius: ${borderRadius}px;
            max-width: 100%;
            object-fit: cover;
            transition: all 0.2s ease;
        }

        #${uniqueId} .newsletter-image:hover {
            transform: scale(1.01);
        }

        #${uniqueId} .ant-image {
            width: 100%;
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
