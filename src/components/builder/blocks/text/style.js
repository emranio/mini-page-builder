export const generateTextStyles = (id, props) => {
    const {
        fontSize = 14,
        fontWeight = 'normal',
        color = '#000000',
        textAlign = 'left'
    } = props;

    return `
        #text-${id} .text-block,
        #text-${id} .text-block-editor {
            font-size: ${fontSize}px;
            font-weight: ${fontWeight};
            color: ${color};
            text-align: ${textAlign};
            margin: 0;
        }
    `;
};
