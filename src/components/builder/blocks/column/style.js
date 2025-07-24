export const generateColumnStyles = (id, props) => {
    const {
        gap = 10,
        backgroundColor = 'transparent',
        borderStyle = 'dashed',
        borderWidth = 1,
        borderColor = '#d9d9d9',
        currentWidths = [],
        columns = 2
    } = props;

    let columnStyles = '';
    if (currentWidths && currentWidths.length > 0) {
        currentWidths.forEach((width, index) => {
            const flexBasis = `${width}%`;
            columnStyles += `
                #column-${id} .column-wrapper[data-column-index="${index}"] {
                    flex: 0 0 ${flexBasis};
                    max-width: ${flexBasis};
                    box-sizing: border-box;
                    display: flex;
                    position: relative;
                    overflow: visible;
                }
            `;
        });
    }

    return `
        #column-${id} .column-element-row {
            margin: 10px 0;
            min-height: 200px;
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
            background-color: ${backgroundColor === 'transparent' ? 'transparent' : backgroundColor};
        }
        
        #column-${id} .column-content {
            flex: 1 1 auto;
            width: 100%;
            min-height: 180px;
            display: flex;
        }
        
        ${columnStyles}
    `;
};
