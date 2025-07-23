import React from 'react';
import { Select, Space, Typography } from 'antd';
import { MobileOutlined, TabletOutlined, LaptopOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Option } = Select;
const { Text } = Typography;

/**
 * ResponsiveViewSelector component for selecting different viewport sizes
 * @param {object} props - Component props
 * @param {string} props.value - Current viewport value
 * @param {function} props.onChange - Callback when viewport changes
 */
const ResponsiveViewSelector = ({ value, onChange }) => {
    const viewports = [
        {
            key: 'desktop',
            name: 'Desktop',
            width: '100%',
            icon: <LaptopOutlined />
        },
        {
            key: 'tablet',
            name: 'Tablet',
            width: '768px',
            icon: <TabletOutlined />
        },
        {
            key: 'mobile',
            name: 'Mobile',
            width: '375px',
            icon: <MobileOutlined />
        }
    ];

    return (
        <Space style={{ marginRight: 0 }}>
            <Text strong>Responsive Preview:</Text>
            <Select
                value={value}
                onChange={onChange}
                style={{ width: 120 }}
                popupMatchSelectWidth={false}
                size='small'
            >
                {viewports.map(viewport => (
                    <Option key={viewport.key} value={viewport.key}>
                        <Space>
                            {viewport.icon}
                            <span>{viewport.name}</span>
                        </Space>
                    </Option>
                ))}
            </Select>
        </Space>
    );
};

ResponsiveViewSelector.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default ResponsiveViewSelector;
