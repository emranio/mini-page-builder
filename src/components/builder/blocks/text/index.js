import { FontSizeOutlined } from '@ant-design/icons';
import TextBlockView from './view';
import TextBlockSettings from './settings';
import TextBlockStyles from './style';
import { makeBlock } from '../../commons/block';

// Create and register the block using makeBlock
const TextBlock = makeBlock({
    type: 'text',
    name: 'Text',
    category: 'content',
    icon: <FontSizeOutlined />,
    view: TextBlockView,
    settings: TextBlockSettings,
    style: TextBlockStyles,
    defaultProps: {
        content: 'Simple text block',
        fontSize: 14,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left'
    }
});

export default TextBlock;
