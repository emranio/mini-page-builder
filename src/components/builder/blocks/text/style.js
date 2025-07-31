/**
 * Text Block Styles - Updated for new structure with wrapper in BlockFactory
 * Targets the fildora-builder-text-block class instead of unique ID
 */

const TextBlockStyles = (props, uniqueId) => {
    const { fontSize, fontWeight, color, textAlign } = props;

    return `
        /* Common styles for all text blocks */
        .fildora-builder-text-block {
            margin: 0;
            cursor: pointer;
        }

        .fildora-builder-text-block:hover .text-block {
            /* Remove outline to reduce visual clutter */
        }

        /* Instance-specific styles using unique ID */
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
