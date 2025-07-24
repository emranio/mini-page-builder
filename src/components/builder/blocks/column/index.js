import { ColumnWidthOutlined } from '@ant-design/icons';
import ColumnBlockView from './view';
import ColumnBlockSettings from './settings';
import ColumnBlockStyles from './style';
import styleManager from '../../../../utils/StyleManager';

// Register the style function
styleManager.registerBlockStyle('column', ColumnBlockStyles);

const ColumnBlock = {
    name: 'Columns',
    category: 'layout',
    icon: <ColumnWidthOutlined />,
    view: ColumnBlockView,
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
};

export { default as ResizeBar } from './ResizeBar';
export default ColumnBlock;
