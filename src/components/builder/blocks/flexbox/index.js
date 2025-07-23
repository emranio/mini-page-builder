import { AppstoreOutlined } from '@ant-design/icons';
import FlexboxBlockView from './view';
import FlexboxBlockSettings from './settings';

const FlexboxBlock = {
    name: 'Container',
    category: 'layout',
    icon: <AppstoreOutlined />,
    view: FlexboxBlockView,
    settings: FlexboxBlockSettings,
    defaultProps: {
        padding: 10,
        margin: 5,
        backgroundColor: 'transparent',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 0
    }
};

export default FlexboxBlock;
