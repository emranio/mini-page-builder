import React from 'react';
import { Select, Group, Text } from '@mantine/core';
import IconDeviceLaptop from '@tabler/icons-react/dist/esm/icons/IconDeviceLaptop';
import IconDeviceTablet from '@tabler/icons-react/dist/esm/icons/IconDeviceTablet';
import IconDeviceMobile from '@tabler/icons-react/dist/esm/icons/IconDeviceMobile';
import PropTypes from 'prop-types';

/**
 * ResponsiveViewSelector component for selecting different viewport sizes
 * @param {object} props - Component props
 * @param {string} props.value - Current viewport value
 * @param {function} props.onChange - Callback when viewport changes
 */
const ResponsiveViewSelector = ({ value, onChange }) => {
    const viewports = [
        {
            value: 'desktop',
            label: 'Desktop',
            width: '100%',
            icon: <IconDeviceLaptop size={16} />
        },
        {
            value: 'tablet',
            label: 'Tablet',
            width: '768px',
            icon: <IconDeviceTablet size={16} />
        },
        {
            value: 'mobile',
            label: 'Mobile',
            width: '375px',
            icon: <IconDeviceMobile size={16} />
        }
    ];

    return (
        <Group gap="xs" style={{ marginRight: 0 }}>
            <Text fw={500} size="sm">Responsive Preview:</Text>
            <Select
                value={value}
                onChange={onChange}
                data={viewports.map(viewport => ({
                    value: viewport.value,
                    label: viewport.label
                }))}
                size="xs"
                w={120}
            />
        </Group>
    );
};

ResponsiveViewSelector.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

export default ResponsiveViewSelector;
