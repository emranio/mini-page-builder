import IconBug from '@tabler/icons-react/dist/esm/icons/IconBug';
import DebugDataBlockView from './view';
import DebugDataBlockSettings from './settings';
import DebugDataBlockStyles from './style';
import { createBlock } from '../../commons/block/BlockFactory';

// Create and register the debug data block
const DebugDataBlock = createBlock({
    name: 'debug-data',
    title: 'Debug Data',
    category: 'content',
    blockType: 'field', // Categorize as field since it displays data
    icon: <IconBug size={16} />,
    view: DebugDataBlockView,
    settings: DebugDataBlockSettings,
    style: DebugDataBlockStyles,
    defaultProps: {
        // No props needed for this block
    },
    settingsConfig: {
        width: 400
    }
});

export default DebugDataBlock;
