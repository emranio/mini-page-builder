/**
 * Example Container Block Styles - Consolidated all container styles here
 * Uses unified dropzone classes and contains all container-specific styling
 */

const ExampleContainerBlockStyles = (props, uniqueId) => {
    const {
        padding = 10,
        margin = 5,
        backgroundColor = 'transparent',
        borderStyle = 'dashed',
        borderWidth = 1,
        borderColor = '#d9d9d9',
        borderRadius = 0
    } = props;

    const backgroundColorValue = backgroundColor === 'transparent'
        ? 'rgba(0, 0, 0, 0.02)'
        : backgroundColor;

    return `
        /* Common styles for all example container blocks */
        .fildora-builder-example-container-block {
            width: 100%;
            position: relative;
            box-sizing: border-box;
            transition: all 0.2s ease;
            min-height: 60px;
            display: flex;
            flex-direction: column;
            cursor: pointer;
        }

        .fildora-builder-example-container-block:hover {
            /* Hover effects handled by unified dropzone styles */
        }

        .fildora-builder-example-container-block.during-drag {
            opacity: 0.8;
            transform: scale(0.98);
        }

        /* Container content - uses unified dropzone styling */
        .fildora-builder-example-container-block .example-container-content {
            flex: 1;
            min-height: 40px;
            width: 100%;
            box-sizing: border-box;
        }

        /* Container actions styling */
        .fildora-builder-example-container-block .container-actions {
            display: flex;
            justify-content: center;
            padding: 5px;
            margin-top: 8px;
            text-align: center;
        }

        .fildora-builder-example-container-block .add-container-button {
            border: 1px dashed #1890ff;
            color: #1890ff;
            background: #f0f0f0;
        }

        .fildora-builder-example-container-block .add-container-button:hover {
            border-style: solid;
            background: #e0e0e0;
        }

        /* Elements inside container take full width */
        .fildora-builder-example-container-block .draggable-block > .block-wrapper > .text-element,
        .fildora-builder-example-container-block .draggable-block > .block-wrapper > .image-element {
            width: 100%;
            box-sizing: border-box;
        }

        /* Instance-specific styles using unique ID */
        #${uniqueId} {
            padding: ${padding}px;
            margin: ${margin}px 0;
            background-color: ${backgroundColorValue};
            border: ${borderWidth}px ${borderStyle} ${borderColor};
            border-radius: ${borderRadius}px;
        }

        #${uniqueId}:hover {
            background-color: ${backgroundColor === 'transparent' ? 'rgba(24, 144, 255, 0.02)' : backgroundColorValue};
        }

        /* Use absolute positioned overlay for hover effects during drag */
        #${uniqueId}::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 1px dashed transparent;
            background-color: transparent;
            pointer-events: none;
            opacity: 0;
            transition: all 0.2s ease;
            z-index: 1;
        }

        #${uniqueId}.during-drag:hover::after {
            background-color: rgba(24, 144, 255, 0.05);
            opacity: 1;
        }
    `;
};

export default ExampleContainerBlockStyles;
