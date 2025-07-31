import IconTypography from '@tabler/icons-react/dist/esm/icons/IconTypography';
import TextBlockView from './view';
import TextBlockEdit from './edit';
import TextBlockSettingsForm from './settings';
import TextBlockStyles from './style';
import { createBlock } from '../../commons/block/BlockFactory';

// Create and register the block using the new simplified BlockFactory
const TextBlock = createBlock({
    name: 'text',
    label: 'Text',
    category: 'content',
    blockType: 'field', // Layout, field, or design type
    icon: <IconTypography size={16} />,
    view: TextBlockView,
    edit: TextBlockEdit, // Simple text block, no complex editing needed
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
        width: 500
    }
});

export default TextBlock;
