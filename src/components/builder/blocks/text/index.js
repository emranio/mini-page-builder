import { FontSizeOutlined } from '@ant-design/icons';
import TextBlockView from './view';
import TextBlockSettingsForm from './settings';
import TextBlockStyles from './style';
import { createBlock } from '../../commons/block/BlockFactory';

// Create and register the block using the new simplified BlockFactory
const TextBlock = createBlock({
    type: 'text',
    name: 'Text',
    category: 'content',
    icon: <FontSizeOutlined />,
    view: TextBlockView,
    settings: TextBlockSettingsForm,
    style: TextBlockStyles,
    defaultProps: {
        content: 'Simple text block',
        fontSize: 14,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left'
    },
    settingsConfig: {
        title: 'Text Settings',
        width: 500
    }
});

export default TextBlock;
