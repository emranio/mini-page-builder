import { AppstoreOutlined } from '@ant-design/icons';
import FlexboxElementView from './view';
import FlexboxElementSettings from './settings';

const FlexboxElement = {
    name: 'Container',
    category: 'layout',
    icon: <AppstoreOutlined />,
    view: FlexboxElementView,
    settings: FlexboxElementSettings,
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

export default FlexboxElement;
