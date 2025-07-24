import { FileTextOutlined } from '@ant-design/icons';
import TabsBlockView from './view';
import TabsBlockSettings from './settings';
import TabsBlockStyles from './style';
import styleManager from '../../../../utils/StyleManager';

// Register the style function
styleManager.registerBlockStyle('tabs', TabsBlockStyles);

const TabsBlock = {
    name: 'Tabs',
    category: 'layout',
    icon: <FileTextOutlined />,
    view: TabsBlockView,
    settings: TabsBlockSettings,
    style: TabsBlockStyles,
    defaultProps: {
        tabs: [
            { id: 'tab1', title: 'Tab 1' },
            { id: 'tab2', title: 'Tab 2' }
        ],
        activeTabId: 'tab1',
        tabIds: [], // Will store the flexbox container IDs for each tab
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 4,
        padding: 10,
        tabStyle: 'default', // default, bordered, card
        tabPosition: 'top' // top, bottom, left, right
    }
};

export default TabsBlock;
