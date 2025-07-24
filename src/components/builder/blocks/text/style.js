/**
 * Text Block Styles
 * Generates dynamic CSS for text blocks
 */

const TextBlockStyles = (props, uniqueId) => {
    const {
        fontSize = 14,
        fontWeight = 'normal',
        color = '#000000',
        textAlign = 'left'
    } = props;

    return `
        #${uniqueId} {
            margin: 0;
            cursor: pointer;
        }

        #${uniqueId} .text-block {
            font-size: ${fontSize}px;
            font-weight: ${fontWeight};
            color: ${color};
            text-align: ${textAlign};
            margin: 0;
            min-height: 1.5em;
            word-wrap: break-word;
            transition: all 0.2s ease;
        }

        #${uniqueId} .text-block:hover {
            outline: 1px dashed rgba(24, 144, 255, 0.5);
            outline-offset: 2px;
        }

        #${uniqueId} .text-block-editor {
            font-size: ${fontSize}px;
            font-weight: ${fontWeight};
            color: ${color};
            text-align: ${textAlign};
            margin: 0;
            width: 100%;
            border: 2px solid #1890ff;
            border-radius: 4px;
            padding: 4px 8px;
            background: rgba(24, 144, 255, 0.05);
        }

        #${uniqueId} .text-block-editor:focus {
            outline: none;
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
    `;
};

export default TextBlockStyles;
