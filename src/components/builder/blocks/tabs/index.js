import { FileTextOutlined } from '@ant-design/icons';
import TabsBlockView from './view';
import TabsBlockEdit from './edit';
import TabsBlockSettings from './settings';
import TabsBlockStyles from './style';
import { createBlock } from '../../commons/block';

// Create and register the block using the new createBlock factory
const TabsBlock = createBlock({
    name: 'tabs',
    title: 'Tabs',
    category: 'layout',
    blockType: 'layout', // Layout, field, or design type
    icon: <FileTextOutlined />,
    view: TabsBlockView,
    edit: TabsBlockEdit, // Complex editing component with Ant Design Tabs
    settings: TabsBlockSettings,
    style: TabsBlockStyles,
    defaultProps: {
        tabs: [
            { id: 'tab1', title: 'Tab 1' },
            { id: 'tab2', title: 'Tab 2' }
        ],
        activeTabId: 'tab1',
        tabIds: [], // Will store the example-container IDs for each tab
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 4,
        padding: 10,
        tabStyle: 'default', // default, bordered, card
        tabPosition: 'top' // top, bottom, left, right
    }
});

export default TabsBlock;
