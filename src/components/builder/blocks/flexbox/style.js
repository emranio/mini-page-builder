/**
 * Flexbox Block Styles
 * Generates dynamic CSS for flexbox/container blocks
 */

const FlexboxBlockStyles = (props, uniqueId) => {
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
        #${uniqueId} {
            width: 100%;
            padding: ${padding}px;
            margin: ${margin}px 0;
            background-color: ${backgroundColorValue};
            border: ${borderWidth}px ${borderStyle} ${borderColor};
            border-radius: ${borderRadius}px;
            position: relative;
            box-sizing: border-box;
            transition: all 0.2s ease;
            min-height: 60px;
            display: flex;
            flex-direction: column;
        }

        #${uniqueId}:hover {
            border-color: rgba(24, 144, 255, 0.6);
            background-color: ${backgroundColor === 'transparent' ? 'rgba(24, 144, 255, 0.02)' : backgroundColorValue};
        }

        #${uniqueId}.during-drag {
            opacity: 0.8;
            transform: scale(0.98);
        }

        #${uniqueId} .flexbox-content {
            flex: 1;
            min-height: 40px;
        }

        #${uniqueId} .container-actions {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
        }

        #${uniqueId}:hover .container-actions {
            opacity: 1;
            pointer-events: auto;
        }

        #${uniqueId} .add-container-button {
            background: rgba(24, 144, 255, 0.9);
            border-color: #1890ff;
            color: white;
            font-size: 12px;
            padding: 4px 8px;
            height: auto;
        }

        #${uniqueId} .add-container-button:hover {
            background: #40a9ff;
            border-color: #40a9ff;
        }
    `;
};

export default FlexboxBlockStyles;
