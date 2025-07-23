import { PictureOutlined } from '@ant-design/icons';
import ImageElementView from './view';
import ImageElementSettings from './settings';

const ImageElement = {
    name: 'Image',
    category: 'media',
    icon: <PictureOutlined />,
    view: ImageElementView,
    settings: ImageElementSettings,
    defaultProps: {
        src: 'https://placehold.co/200x50?text=click+to+edit&font=roboto',
        alt: 'Image',
        width: '100%',
        height: 'auto',
        borderRadius: 0
    }
};

export default ImageElement;
