/**
 * Tabs Block Styles - Updated for new structure with wrapper in BlockFactory
 * Targets the fildora-builder-tabs-block class instead of unique ID
 */

const TabsBlockStyles = (props, uniqueId) => {
    const {
        backgroundColor = 'transparent',
        borderStyle = 'solid',
        borderWidth = 1,
        borderColor = '#d9d9d9',
        borderRadius = 4,
        padding = 10,
        tabStyle = 'default',
        tabPosition = 'top'
    } = props;

    const backgroundColorValue = backgroundColor === 'transparent'
        ? 'transparent'
        : backgroundColor;

    return `
        /* Common styles for all tabs blocks */
        .fildora-builder-tabs-block {
            margin: 10px 0;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            min-height: 200px;
        }

        .fildora-builder-tabs-block:hover {
            outline: 1px dashed rgba(24, 144, 255, 0.3);
            outline-offset: 2px;
        }

        .fildora-builder-tabs-block.during-drag {
            opacity: 0.8;
        }

        .fildora-builder-tabs-block .ant-tabs {
            height: 100%;
        }

        .fildora-builder-tabs-block .ant-tabs-content-holder {
            min-height: 150px;
        }

        .fildora-builder-tabs-block .ant-tabs-tabpane {
            height: 100%;
            min-height: 150px;
        }

        .fildora-builder-tabs-block .ant-tabs-tab {
            ${tabStyle === 'card' ? 'background: #f5f5f5; border: 1px solid #d9d9d9; margin-right: 2px;' : ''}
        }

        .fildora-builder-tabs-block .ant-tabs-tab.ant-tabs-tab-active {
            ${tabStyle === 'card' ? 'background: white; border-bottom-color: white;' : ''}
        }

        /* Position-specific styles */
        ${tabPosition === 'left' || tabPosition === 'right' ? `
            .fildora-builder-tabs-block .ant-tabs-tab {
                text-align: center;
            }
        ` : ''}

        ${tabPosition === 'bottom' ? `
            .fildora-builder-tabs-block .ant-tabs-tab {
                ${tabStyle === 'card' ? 'border-top-color: white;' : ''}
            }
        ` : ''}

        .fildora-builder-tabs-block .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100px;
            color: #8c8c8c;
            font-style: italic;
        }

        /* DropZone styling within tabs */
        .fildora-builder-tabs-block .drop-zone {
            min-height: 120px;
            border: 2px dashed #e8e8e8;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #8c8c8c;
            transition: all 0.2s ease;
        }

        .fildora-builder-tabs-block .drop-zone:hover {
            border-color: #1890ff;
            background: rgba(24, 144, 255, 0.02);
        }

        .fildora-builder-tabs-block .drop-zone.drag-over {
            border-color: #1890ff;
            background: rgba(24, 144, 255, 0.05);
            color: #1890ff;
        }

        /* Instance-specific styles using unique ID */
        #${uniqueId} {
            background-color: ${backgroundColorValue};
            border: ${borderStyle === 'none' ? 'none' : `${borderWidth}px ${borderStyle} ${borderColor}`};
            border-radius: ${borderRadius}px;
            padding: ${padding}px;
        }

        #${uniqueId}:hover {
            ${borderStyle !== 'none' ? `border-color: rgba(24, 144, 255, 0.6);` : ''}
            background-color: ${backgroundColor === 'transparent' ? 'rgba(24, 144, 255, 0.02)' : backgroundColorValue};
        }
    `;
};

export default TabsBlockStyles;
