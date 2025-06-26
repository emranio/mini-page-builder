import { FontSizeOutlined } from '@ant-design/icons';
import TextElementView from './view';
import TextElementSettings from './settings';

const TextElement = {
    name: 'Text',
    category: 'content',
    icon: <FontSizeOutlined />,
    view: TextElementView,
    settings: TextElementSettings,
    defaultProps: {
        content: 'Click to edit text',
        fontSize: 14,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left'
    }
};

export default TextElement;
