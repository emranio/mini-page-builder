export const generateTabsStyles = (id, props) => {
    const {
        backgroundColor = 'transparent',
        borderStyle = 'solid',
        borderWidth = 1,
        borderColor = '#d9d9d9',
        borderRadius = 4,
        padding = 10
    } = props;

    return `
        #tabs-${id} {
            background-color: ${backgroundColor === 'transparent' ? 'transparent' : backgroundColor};
            border: ${borderWidth}px ${borderStyle} ${borderColor};
            border-radius: ${borderRadius}px;
            padding: ${padding}px;
            position: relative;
            width: 100%;
            min-height: 300px;
        }
        
        #tabs-${id} .tab-content {
            min-height: 200px;
            padding: 10px;
        }
    `;
};
