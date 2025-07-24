import { FontSizeOutlined } from '@ant-design/icons';
import TextBlockView from './view';
import TextBlockSettings from './settings';
import { generateTextStyles } from './style';
import { withBaseBlock } from '../../commons/base';

const TextBlock = {
    name: 'Text',
    category: 'content',
    icon: <FontSizeOutlined />,
    view: withBaseBlock(TextBlockView, { style: generateTextStyles, name: 'Text' }),
    settings: TextBlockSettings,
    style: generateTextStyles,
    defaultProps: {
        content: 'Click to edit text',
        fontSize: 14,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left'
    }
};

export default TextBlock;
