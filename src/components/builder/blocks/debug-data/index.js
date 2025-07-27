import { BugOutlined } from '@ant-design/icons';
import DebugDataBlockView from './view';
import DebugDataBlockSettings from './settings';
import DebugDataBlockStyles from './style';
import { createBlock } from '../../commons/block/BlockFactory';

// Create and register the debug data block
const DebugDataBlock = createBlock({
    type: 'debug-data',
    title: 'Debug Data',
    category: 'content',
    blockType: 'field', // Categorize as field since it displays data
    icon: <BugOutlined />,
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
