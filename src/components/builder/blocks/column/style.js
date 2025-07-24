/**
 * Column Block Styles
 * Generates dynamic CSS for column blocks
 */

const ColumnBlockStyles = (props, uniqueId) => {
    const {
        gap = 10,
        backgroundColor = 'transparent',
        borderStyle = 'dashed',
        borderWidth = 1,
        borderColor = '#d9d9d9',
        columnWidths = [50, 50]
    } = props;

    const backgroundColorValue = backgroundColor === 'transparent'
        ? 'transparent'
        : backgroundColor;

    return `
        #${uniqueId} {
            margin: 10px 0;
            cursor: pointer;
        }

        #${uniqueId}:hover {
            outline: 1px dashed rgba(24, 144, 255, 0.3);
            outline-offset: 2px;
        }

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
            transition: all 0.2s ease;
        }

        #${uniqueId} .column-element-row:hover {
            border-color: rgba(24, 144, 255, 0.6);
            background-color: ${backgroundColor === 'transparent' ? 'rgba(24, 144, 255, 0.02)' : backgroundColorValue};
        }

        #${uniqueId} .column-element-row.during-drag {
            opacity: 0.8;
        }

        #${uniqueId} .column-wrapper {
            box-sizing: border-box;
            display: flex;
            position: relative;
            overflow: visible;
        }

        #${uniqueId} .column-content {
            flex: 1 1 auto;
            width: 100%;
            min-height: 180px;
            display: flex;
        }

        #${uniqueId} .column-drop-area {
            flex: 1;
            min-height: 180px;
            border: 1px dashed rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            position: relative;
            transition: all 0.2s ease;
        }

        #${uniqueId} .column-drop-area:hover {
            border-color: rgba(24, 144, 255, 0.4);
            background-color: rgba(24, 144, 255, 0.02);
        }

        #${uniqueId} .column-drop-area.during-drag {
            border-color: #1890ff;
            background-color: rgba(24, 144, 255, 0.05);
        }

        #${uniqueId} .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #999;
            font-size: 12px;
        }

        /* Resize bar styles */
        #${uniqueId} .resize-bar {
            position: absolute;
            top: 0;
            right: -5px;
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

        #${uniqueId} .column-wrapper:hover .resize-bar {
            opacity: 1;
        }

        #${uniqueId} .resize-bar-handle {
            width: 2px;
            height: 60%;
            background-color: #1890ff;
            border-radius: 1px;
            transition: all 0.2s ease;
        }

        #${uniqueId} .resize-bar:hover .resize-bar-handle {
            width: 3px;
            background-color: #40a9ff;
        }

        #${uniqueId} .resize-bar.resizing .resize-bar-handle {
            width: 3px;
            background-color: #1890ff;
            box-shadow: 0 0 8px rgba(24, 144, 255, 0.3);
        }
    `;
};

export default ColumnBlockStyles;
