import IconLayout from '@tabler/icons-react/dist/esm/icons/IconLayout';
import ContainerBlockView from './view';
import ContainerBlockEdit from './edit';
import ContainerBlockSettings from './settings';
import ContainerBlockStyles from './style';
import { createBlock } from '../../commons/block';

// Create and register the block using the new createBlock factory
const ContainerBlock = createBlock({
    name: 'container',
    label: 'Container',
    category: 'layout',
    blockType: 'layout', // Layout, field, or design type
    icon: <IconLayout size={16} />,
    view: ContainerBlockView,
    edit: ContainerBlockEdit, // Complex editing component with DropZone
    settings: ContainerBlockSettings,
    style: ContainerBlockStyles,
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

export default ContainerBlock;
