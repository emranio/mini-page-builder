import { ColumnWidthOutlined } from '@ant-design/icons';
import ColumnBlockView from './view';
import ColumnBlockSettings from './settings';

const ColumnBlock = {
    name: 'Columns',
    category: 'layout',
    icon: <ColumnWidthOutlined />,
    view: ColumnBlockView,
    settings: ColumnBlockSettings,
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
