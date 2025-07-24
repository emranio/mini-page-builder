export const generateFlexboxStyles = (id, props) => {
    const {
        padding = 10,
        margin = 5,
        backgroundColor = 'transparent',
        borderStyle = 'dashed',
        borderWidth = 1,
        borderColor = '#d9d9d9',
        borderRadius = 0
    } = props;

    return `
        #flexbox-${id} {
            width: 100%;
            padding: ${padding}px;
            margin: ${margin}px 0;
            background-color: ${backgroundColor === 'transparent' ? 'rgba(0, 0, 0, 0.02)' : backgroundColor};
            border: ${borderWidth}px ${borderStyle} ${borderColor};
            border-radius: ${borderRadius}px;
            position: relative;
            box-sizing: border-box;
            transition: all 0.2s ease;
        }
    `;
};
