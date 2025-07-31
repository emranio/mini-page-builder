import React, { useEffect, useMemo } from 'react';
import { Slider, NumberInput, Select, Button, ColorInput, Stack, Text } from '@mantine/core';
import Form, { Field } from 'rc-field-form';

const ColumnBlockSettings = ({ form, element, initialValues, throttledUpdate }) => {
    const columns = element.props?.columns || 2;
    const columnWidths = useMemo(() => element.props?.columnWidths || [], [element.props?.columnWidths]);

    // Update form values when element props change (e.g., when resizing from right panel)
    useEffect(() => {
        if (!form) return;

        const newValues = {
            columns: columns,
            columnWidths: columnWidths.length > 0 ? columnWidths : Array(columns).fill(Math.round((100 / columns) * 100) / 100),
            gap: element.props?.gap || 10,
            backgroundColor: element.props?.backgroundColor || 'transparent',
            borderStyle: element.props?.borderStyle || 'dashed',
            borderWidth: element.props?.borderWidth || 1,
            borderColor: element.props?.borderColor || '#d9d9d9'
        };
        form.setFieldsValue(newValues);
    }, [form, element.props, columns, columnWidths]);

    const handleValuesChange = (changedValues, allValues) => {
        // Live update the element as user changes settings
        throttledUpdate(element.id, allValues);
    };

    // Dynamic form items for column widths
    const renderColumnWidthFields = (formColumnCount) => {
        const columnCount = formColumnCount || columns;

        return Array(columnCount).fill(0).map((_, index) => (
            <Field
                key={`width-${index}`}
                name={['columnWidths', index]}
                rules={[{ required: true, message: 'Please input the column width' }]}
            >
                <Stack gap="xs">
                    <Text size="sm" fw={500}>{`Column ${index + 1} Width (%)`}</Text>
                    <NumberInput
                        min={5}
                        max={95}
                        step={0.01}
                        precision={2}
                        suffix="%"
                        style={{ width: '100%' }}
                    />
                </Stack>
            </Field>
        ));
    };

    return (
        <>
            <Field
                name="columns"
                rules={[{ required: true, message: 'Please select the number of columns' }]}
            >
                <Stack gap="xs">
                    <Text size="sm" fw={500}>Number of Columns</Text>
                    <Slider
                        min={2}
                        max={12}
                        marks={[
                            { value: 2, label: '2' },
                            { value: 4, label: '4' },
                            { value: 6, label: '6' },
                            { value: 8, label: '8' },
                            { value: 10, label: '10' },
                            { value: 12, label: '12' }
                        ]}
                        onChange={(value) => {
                            // When column count changes, immediately update column widths
                            const equalWidth = Math.floor(100 / value);
                            form?.setFieldsValue({
                                columnWidths: Array(value).fill(equalWidth)
                            });
                            // Trigger live update
                            const allValues = form?.getFieldsValue() || {};
                            allValues.columnWidths = Array(value).fill(equalWidth);
                            handleValuesChange({ columns: value, columnWidths: allValues.columnWidths }, allValues);
                        }}
                    />
                </Stack>
            </Field>

            <div className="column-widths-container">
                {renderColumnWidthFields(form?.getFieldValue('columns') || columns)}
            </div>

            <Stack gap="xs">
                <Button
                    variant="outline"
                    onClick={() => {
                        // Distribute column widths evenly
                        const count = form?.getFieldValue('columns') || columns;
                        const equalWidth = Math.floor(100 / count);
                        const newWidths = Array(count).fill(equalWidth);
                        form?.setFieldsValue({
                            columnWidths: newWidths
                        });
                        // Trigger live update
                        const allValues = form?.getFieldsValue() || {};
                        allValues.columnWidths = newWidths;
                        handleValuesChange({ columnWidths: newWidths }, allValues);
                    }}
                >
                    Distribute Evenly
                </Button>
            </Stack>

            <Field name="gap">
                <Stack gap="xs">
                    <Text size="sm" fw={500}>Gap Between Columns</Text>
                    <NumberInput
                        min={0}
                        max={50}
                        suffix="px"
                        style={{ width: '100%' }}
                    />
                </Stack>
            </Field>

            <Field name="backgroundColor">
                <Stack gap="xs">
                    <Text size="sm" fw={500}>Background Color</Text>
                    <Select
                        data={[
                            { value: 'transparent', label: 'Transparent' },
                            { value: '#ffffff', label: 'White' },
                            { value: '#f0f0f0', label: 'Light Gray' },
                            { value: '#e8e8e8', label: 'Gray' }
                        ]}
                        style={{ width: '100%' }}
                    />
                </Stack>
            </Field>

            <Field name="borderStyle">
                <Stack gap="xs">
                    <Text size="sm" fw={500}>Border Style</Text>
                    <Select
                        data={[
                            { value: 'none', label: 'None' },
                            { value: 'solid', label: 'Solid' },
                            { value: 'dashed', label: 'Dashed' },
                            { value: 'dotted', label: 'Dotted' }
                        ]}
                        style={{ width: '100%' }}
                    />
                </Stack>
            </Field>

            <Field name="borderWidth">
                <Stack gap="xs">
                    <Text size="sm" fw={500}>Border Width</Text>
                    <NumberInput
                        min={0}
                        max={10}
                        suffix="px"
                        style={{ width: '100%' }}
                    />
                </Stack>
            </Field>

            <Field name="borderColor">
                <Stack gap="xs">
                    <Text size="sm" fw={500}>Border Color</Text>
                    <ColorInput
                        format="hex"
                        style={{ width: '100%' }}
                        onChange={(value) => {
                            form?.setFieldsValue({ borderColor: value });
                            const allValues = form?.getFieldsValue() || {};
                            handleValuesChange({ borderColor: value }, allValues);
                        }}
                    />
                </Stack>
            </Field>
        </>
    );
};

export default ColumnBlockSettings;
