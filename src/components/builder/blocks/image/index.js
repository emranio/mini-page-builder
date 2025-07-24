import { PictureOutlined } from '@ant-design/icons';
import ImageBlockView from './view';
import ImageBlockSettings from './settings';
import { generateImageStyles } from './style';
import { withBaseBlock } from '../../commons/base';

const ImageBlock = {
    name: 'Image',
    category: 'media',
    icon: <PictureOutlined />,
    view: withBaseBlock(ImageBlockView, { style: generateImageStyles, name: 'Image' }),
    settings: ImageBlockSettings,
    style: generateImageStyles,
    defaultProps: {
        src: 'https://placehold.co/200x50?text=click+to+edit&font=roboto',
        alt: 'Image',
        width: '100%',
        height: 'auto',
        borderRadius: 0
    }
};

export default ImageBlock;
