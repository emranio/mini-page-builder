import { AppstoreOutlined } from '@ant-design/icons';
import FlexboxBlockView from './view';
import FlexboxBlockSettings from './settings';
import FlexboxBlockStyles from './style';
import makeBlock from '../../../../utils/makeBlock';

// Create and register the block using makeBlock
const FlexboxBlock = makeBlock({
    type: 'flexbox',
    name: 'Container',
    category: 'layout',
    icon: <AppstoreOutlined />,
    view: FlexboxBlockView,
    settings: FlexboxBlockSettings,
    style: FlexboxBlockStyles,
    defaultProps: {
        padding: 10,
        margin: 5,
        backgroundColor: 'transparent',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 0
    }
});

export default FlexboxBlock;
