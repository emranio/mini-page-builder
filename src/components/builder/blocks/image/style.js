export const generateImageStyles = (id, props) => {
    const {
        width = '100%',
        height = 'auto',
        borderRadius = 0
    } = props;

    return `
        #image-${id} img {
            width: ${width};
            height: ${height};
            border-radius: ${borderRadius}px;
        }
        
        #image-${id} {
            cursor: pointer;
        }
    `;
};
