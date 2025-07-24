import { FontSizeOutlined } from '@ant-design/icons';
import TextBlockView from './view';
import TextBlockSettings from './settings';
import TextBlockStyles from './style';
import styleManager from '../../../../utils/StyleManager';

// Register the style function
styleManager.registerBlockStyle('text', TextBlockStyles);

const TextBlock = {
    name: 'Text',
    category: 'content',
    icon: <FontSizeOutlined />,
    view: TextBlockView,
    settings: TextBlockSettings,
    style: TextBlockStyles,
    defaultProps: {
        content: 'Click to edit text',
        fontSize: 14,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left'
    }
};

export default TextBlock;
