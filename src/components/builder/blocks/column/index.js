import { ColumnWidthOutlined } from '@ant-design/icons';
import ColumnBlockView from './view';
import ColumnBlockSettings from './settings';
import { generateColumnStyles } from './style';
import { withBaseBlock } from '../../commons/base';

const ColumnBlock = {
    name: 'Column',
    category: 'layout',
    icon: <ColumnWidthOutlined />,
    view: withBaseBlock(ColumnBlockView, { style: generateColumnStyles, name: 'Column' }),
    settings: ColumnBlockSettings,
    style: generateColumnStyles,
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
