import { ColumnWidthOutlined } from '@ant-design/icons';
import ColumnBlockView from './view';
import ColumnBlockEdit from './edit';
import ColumnBlockSettings from './settings';
import ColumnBlockStyles from './style';
import { createBlock } from '../../commons/block';

// Create and register the block using the new createBlock factory
const ColumnBlock = createBlock({
    name: 'column',
    title: 'Columns',
    category: 'layout',
    blockType: 'layout', // Layout, field, or design type
    icon: <ColumnWidthOutlined />,
    view: ColumnBlockView,
    edit: ColumnBlockEdit, // Complex editing component with drag/drop and resizing
    settings: ColumnBlockSettings,
    style: ColumnBlockStyles,
    defaultProps: {
        columns: 2,
        columnWidths: [50, 50],
        columnIds: [],
        gap: 10,
        backgroundColor: 'transparent',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#d9d9d9'
    }
});

export { default as ResizeBar } from './ResizeBar';
export default ColumnBlock;
