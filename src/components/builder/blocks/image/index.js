import { PictureOutlined } from '@ant-design/icons';
import ImageBlockView from './view';
import ImageBlockSettings from './settings';
import ImageBlockStyles from './style';
import { createBlock } from '../../commons/block/BlockFactory';

// Create and register the block using the new simplified BlockFactory
const ImageBlock = createBlock({
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
    },
    settingsConfig: {
        title: 'Image Settings',
        width: 500
    }
});

export default ImageBlock;
