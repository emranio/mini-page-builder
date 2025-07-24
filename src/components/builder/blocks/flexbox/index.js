import { AppstoreOutlined } from '@ant-design/icons';
import FlexboxBlockView from './view';
import FlexboxBlockSettings from './settings';
import { generateFlexboxStyles } from './style';
import { withBaseBlock } from '../../commons/base';

const FlexboxBlock = {
    name: 'Flexbox',
    category: 'layout',
    icon: <AppstoreOutlined />,
    view: withBaseBlock(FlexboxBlockView, { style: generateFlexboxStyles, name: 'Flexbox' }),
    settings: FlexboxBlockSettings,
    style: generateFlexboxStyles,
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
