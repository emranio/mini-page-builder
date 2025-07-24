/**
 * Tabs Block Styles
 * Generates dynamic CSS for tabs blocks
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
        #${uniqueId} {
            margin: 10px 0;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        #${uniqueId}:hover {
            outline: 1px dashed rgba(24, 144, 255, 0.3);
            outline-offset: 2px;
        }

        #${uniqueId} .tabs-container {
            background-color: ${backgroundColorValue};
            border: ${borderStyle === 'none' ? 'none' : `${borderWidth}px ${borderStyle} ${borderColor}`};
            border-radius: ${borderRadius}px;
            padding: ${padding}px;
            position: relative;
            min-height: 200px;
            transition: all 0.2s ease;
        }

        #${uniqueId} .tabs-container:hover {
            ${borderStyle !== 'none' ? `border-color: rgba(24, 144, 255, 0.6);` : ''}
            background-color: ${backgroundColor === 'transparent' ? 'rgba(24, 144, 255, 0.02)' : backgroundColorValue};
        }

        #${uniqueId} .tabs-container.during-drag {
            opacity: 0.8;
        }

        /* Ant Design Tabs Customization */
        #${uniqueId} .ant-tabs {
            width: 100%;
        }

        #${uniqueId} .ant-tabs-tab {
            transition: all 0.2s ease;
        }

        #${uniqueId} .ant-tabs-tab:hover {
            color: #40a9ff;
        }

        #${uniqueId} .ant-tabs-tab-active {
            color: #1890ff !important;
        }

        #${uniqueId} .ant-tabs-ink-bar {
            background: #1890ff;
        }

        #${uniqueId} .ant-tabs-content-holder {
            padding: 16px 0;
            min-height: 200px;
        }

        #${uniqueId} .ant-tabs-tabpane {
            min-height: 120px;
            padding: 10px;
        }

        /* Tab-specific styles based on position */
        ${tabPosition === 'left' || tabPosition === 'right' ? `
            #${uniqueId} .ant-tabs-tab {
                margin: 0 0 4px 0;
            }
        ` : `
            #${uniqueId} .ant-tabs-tab {
                margin: 0 4px 0 0;
            }
        `}

        /* Card style tabs */
        ${tabStyle === 'card' ? `
            #${uniqueId} .ant-tabs-card .ant-tabs-tab {
                background: #fafafa;
                border: 1px solid #d9d9d9;
                border-radius: 6px 6px 0 0;
                margin-right: 2px;
            }
            
            #${uniqueId} .ant-tabs-card .ant-tabs-tab-active {
                background: #fff;
                border-bottom-color: #fff;
            }
        ` : ''}

        /* Loading and empty states */
        #${uniqueId} .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 120px;
            color: #999;
            font-size: 12px;
        }
    `;
};

export default TabsBlockStyles;
