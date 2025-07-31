/**
 * Column Block Styles - Updated for new structure with wrapper in BlockFactory
 * Targets the fildora-builder-column-block class instead of unique ID
 */

const ColumnBlockStyles = (props, uniqueId) => {
    const {
        gap = 10,
        backgroundColor = 'transparent',
        borderStyle = 'dashed',
        borderWidth = 1,
        borderColor = '#d9d9d9'
    } = props;

    const backgroundColorValue = backgroundColor === 'transparent'
        ? 'transparent'
        : backgroundColor;

    return `
        /* Common styles for all column blocks */
        .fildora-builder-column-block {
            margin: 10px 0;
            cursor: pointer;
        }

        .fildora-builder-column-block:hover {
            /* Remove outline to reduce visual clutter */
        }

        .fildora-builder-column-block .column-element-row.during-drag {
            opacity: 0.8;
        }

        .fildora-builder-column-block .column-wrapper {
            box-sizing: border-box;
            display: flex;
            position: relative;
            overflow: visible;
            will-change: flex-basis, max-width;
        }

        .fildora-builder-column-block .column-content {
            flex: 1 1 auto;
            width: 100%;
            min-height: 180px;
            display: flex;
        }

        /* Column dropzones use unified styling from UnifiedDropzones.scss */
        .fildora-builder-column-block .drop-zone {
            flex: 1;
            width: 100%;
        }

        .fildora-builder-column-block .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #999;
            font-size: 12px;
        }

        /* Resize bar styles */
        .fildora-builder-column-block .resize-bar {
            position: absolute;
            top: 0;
            right: calc(-${gap / 2}px);
            width: 10px;
            height: 100%;
            cursor: col-resize;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .fildora-builder-column-block .column-element-row:hover .resize-bar {
            opacity: 0.6;
        }
        
        .fildora-builder-column-block .column-wrapper:hover .resize-bar {
            opacity: 1;
        }
        
        .fildora-builder-column-block .resize-bar:hover {
            opacity: 1;
        }

        .fildora-builder-column-block .resize-bar-handle {
            width: 4px;
            height: 60%;
            background-color: #1890ff;
            border-radius: 2px;
            transition: all 0.2s ease;
            position: relative;
            left: 0;
            transform: translateX(-50%);
        }

        .fildora-builder-column-block .resize-bar:hover .resize-bar-handle {
            width: 4px;
            background-color: #40a9ff;
            box-shadow: 0 0 6px rgba(24, 144, 255, 0.5);
        }

        .fildora-builder-column-block .resize-bar.resizing .resize-bar-handle {
            width: 4px;
            background-color: #1890ff;
            box-shadow: 0 0 8px rgba(24, 144, 255, 0.8);
        }

        /* Instance-specific styles using unique ID */
        #${uniqueId} .column-element-row {
            border: ${borderWidth}px ${borderStyle} ${borderColor};
            padding: 10px;
            width: 100%;
            overflow: hidden;
            position: relative;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            gap: ${gap}px;
            align-items: stretch;
            justify-content: space-between;
            background-color: ${backgroundColorValue};
            min-height: 200px;
            transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        #${uniqueId} .column-element-row:hover {
            border-color: rgba(24, 144, 255, 0.6);
            background-color: ${backgroundColor === 'transparent' ? 'rgba(24, 144, 255, 0.02)' : backgroundColorValue};
        }
    `;
};

export default ColumnBlockStyles;
