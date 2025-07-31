import IconPhoto from '@tabler/icons-react/dist/esm/icons/IconPhoto';
import ImageBlockView from './view';
import ImageBlockSettings from './settings';
import ImageBlockStyles from './style';
import { createBlock } from '../../commons/block/BlockFactory';

// Create and register the block using the new simplified BlockFactory
const ImageBlock = createBlock({
    name: 'image',
    label: 'Image',
    category: 'media',
    blockType: 'design', // Layout, field, or design type
    icon: <IconPhoto size={16} />,
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
        width: 500
    }
});

export default ImageBlock;
