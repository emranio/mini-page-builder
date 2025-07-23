import { ColumnWidthOutlined } from '@ant-design/icons';
import ColumnElementView from './view';
import ColumnElementSettings from './settings';

const ColumnElement = {
    name: 'Columns',
    category: 'layout',
    icon: <ColumnWidthOutlined />,
    view: ColumnElementView,
    settings: ColumnElementSettings,
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
export default ColumnElement;
