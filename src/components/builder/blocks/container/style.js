/**
 * Container Block Styles - Updated for new structure with wrapper in BlockFactory
 * Targets the fildora-builder-container-block class instead of unique ID
 */

const ContainerBlockStyles = (props, uniqueId) => {
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
        /* Common styles for all container blocks */
        .fildora-builder-container-block {
            width: 100%;
            position: relative;
            box-sizing: border-box;
            transition: all 0.2s ease;
            min-height: 60px;
            display: flex;
            flex-direction: column;
            cursor: pointer;
        }

        .fildora-builder-container-block:hover {
            border-color: rgba(24, 144, 255, 0.6);
        }

        .fildora-builder-container-block.during-drag {
            opacity: 0.8;
            transform: scale(0.98);
        }

        .fildora-builder-container-block .container-content {
            flex: 1;
            min-height: 40px;
        }

        .fildora-builder-container-block .container-actions {
            display: flex;
            justify-content: center;
            padding: 5px;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            background: rgba(255, 255, 255, 0.8);
        }

        .fildora-builder-container-block .add-container-button {
            border: 1px dashed #1890ff;
            color: #1890ff;
            background: transparent;
        }

        .fildora-builder-container-block .add-container-button:hover {
            border-style: solid;
            background: rgba(24, 144, 255, 0.1);
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
    `;
};

export default ContainerBlockStyles;
