import React, { useEffect, useMemo } from 'react';
import { Slider, NumberInput, Select, Button, ColorInput, Stack, Text } from '@mantine/core';
import { Field } from 'rc-field-form';
import VisualColumnResizer from './VisualColumnResizer';

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

    // Handle visual resizer changes
    const handleVisualResizerChange = (newWidths) => {
        // Update form values
        form?.setFieldsValue({
            columnWidths: newWidths
        });

        // Trigger live update
        const allValues = form?.getFieldsValue() || {};
        allValues.columnWidths = newWidths;
        handleValuesChange({ columnWidths: newWidths }, allValues);
    };

    return (
        <Stack gap="md">
            <Stack gap="xs">
                <Text size="sm" fw={500}>Number of Columns</Text>
                <Field
                    name="columns"
                    rules={[{ required: true, message: 'Please select the number of columns' }]}
                >
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
                            const newWidths = Array(value).fill(equalWidth);
                            form?.setFieldsValue({
                                columns: value,
                                columnWidths: newWidths
                            });

                            // Trigger live update
                            const allValues = form?.getFieldsValue() || {};
                            allValues.columns = value;
                            allValues.columnWidths = newWidths;
                            handleValuesChange({ columns: value, columnWidths: newWidths }, allValues);
                        }}
                    />
                </Field>
            </Stack>

            {/* Visual Column Resizer */}
            <VisualColumnResizer
                columns={form?.getFieldValue('columns') || columns}
                columnWidths={form?.getFieldValue('columnWidths') || Array(columns).fill(Math.floor(100 / columns))}
                onChange={handleVisualResizerChange}
            />

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

            <Stack gap="xs">
                <Text size="sm" fw={500}>Gap Between Columns</Text>
                <Field name="gap">
                    <NumberInput
                        min={0}
                        max={50}
                        suffix="px"
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Background Color</Text>
                <Field name="backgroundColor">
                    <Select
                        data={[
                            { value: 'transparent', label: 'Transparent' },
                            { value: '#ffffff', label: 'White' },
                            { value: '#f0f0f0', label: 'Light Gray' },
                            { value: '#e8e8e8', label: 'Gray' }
                        ]}
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Border Style</Text>
                <Field name="borderStyle">
                    <Select
                        data={[
                            { value: 'none', label: 'None' },
                            { value: 'solid', label: 'Solid' },
                            { value: 'dashed', label: 'Dashed' },
                            { value: 'dotted', label: 'Dotted' }
                        ]}
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Border Width</Text>
                <Field name="borderWidth">
                    <NumberInput
                        min={0}
                        max={10}
                        suffix="px"
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Border Color</Text>
                <Field name="borderColor">
                    <ColorInput
                        format="hex"
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>
        </Stack>
    );
};

export default ColumnBlockSettings;
