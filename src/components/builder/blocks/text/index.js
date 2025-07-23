import { FontSizeOutlined } from '@ant-design/icons';
import TextBlockView from './view';
import TextBlockSettings from './settings';

const TextBlock = {
    name: 'Text',
    category: 'content',
    icon: <FontSizeOutlined />,
    view: TextBlockView,
    settings: TextBlockSettings,
    defaultProps: {
        content: 'Click to edit text',
        fontSize: 14,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left'
    }
};

export default TextBlock;
