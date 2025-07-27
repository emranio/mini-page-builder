import { AppstoreOutlined } from '@ant-design/icons';
import ExampleContainerBlockView from './view';
import ExampleContainerBlockSettings from './settings';
import ExampleContainerBlockStyles from './style';
import { createBlock } from '../../commons/block';

// Create and register the block using the new createBlock factory
const ExampleContainerBlock = createBlock({
    type: 'example-container',
    name: 'Example Container',
    category: 'layout',
    blockType: 'layout', // Layout, field, or design type
    icon: <AppstoreOutlined />,
    view: ExampleContainerBlockView,
    settings: ExampleContainerBlockSettings,
    style: ExampleContainerBlockStyles,
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

export default ExampleContainerBlock;
