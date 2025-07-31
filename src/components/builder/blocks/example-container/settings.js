import React from 'react';
import { NumberInput, Select, ColorInput, Stack, Text } from '@mantine/core';
import { Field } from 'rc-field-form';

/**
 * ExampleContainerBlockSettings - Simplified form component for new architecture
 * Common functionality (form handling, prop defaults) is handled by createBlockSettings factory
 */
const ExampleContainerBlockSettings = ({ form }) => {
    return (
        <>
            <Field name="padding">
                <Stack gap="xs">
                    <Text size="sm" fw={500}>Padding</Text>
                    <NumberInput
                        min={0}
                        max={50}
                        suffix="px"
                        style={{ width: '100%' }}
                    />
                </Stack>
            </Field>

            <Field name="margin">
                <Stack gap="xs">
                    <Text size="sm" fw={500}>Margin</Text>
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
                        }}
                    />
                </Stack>
            </Field>

            <Field name="borderRadius">
                <Stack gap="xs">
                    <Text size="sm" fw={500}>Border Radius</Text>
                    <NumberInput
                        min={0}
                        max={50}
                        suffix="px"
                        style={{ width: '100%' }}
                    />
                </Stack>
            </Field>
        </>
    );
};

export default ExampleContainerBlockSettings;
