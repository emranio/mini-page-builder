import { PictureOutlined } from '@ant-design/icons';
import ImageBlockView from './view';
import ImageBlockSettings from './settings';
import ImageBlockStyles from './style';
import makeBlock from '../../commons/block/makeBlock';

// Create and register the block using makeBlock
const ImageBlock = makeBlock({
    type: 'image',
    name: 'Image',
    category: 'media',
    icon: <PictureOutlined />,
    view: ImageBlockView,
    settings: ImageBlockSettings,
    style: ImageBlockStyles,
    defaultProps: {
        src: 'https://placehold.co/200x50?text=click+to+edit&font=roboto',
        alt: 'Image',
        width: '100%',
        height: 'auto',
        borderRadius: 0
    }
});

export default ImageBlock;
