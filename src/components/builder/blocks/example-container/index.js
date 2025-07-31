import IconLayout from '@tabler/icons-react/dist/esm/icons/IconLayout';
import ExampleContainerBlockView from './view';
import ExampleContainerBlockEdit from './edit';
import ExampleContainerBlockSettings from './settings';
import ExampleContainerBlockStyles from './style';
import { createBlock } from '../../commons/block';

// Create and register the block using the new createBlock factory
const ExampleContainerBlock = createBlock({
    name: 'example-container',
    title: 'Example Container',
    category: 'layout',
    blockType: 'layout', // Layout, field, or design type
    icon: <IconLayout size={16} />,
    view: ExampleContainerBlockView,
    edit: ExampleContainerBlockEdit, // Complex editing component with DropZone
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
