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
            <Stack gap="xs">
                <Text size="sm" fw={500}>Padding</Text>
                <Field name="padding">
                    <NumberInput
                        min={0}
                        max={50}
                        suffix="px"
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Margin</Text>
                <Field name="margin">
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

            <Stack gap="xs">
                <Text size="sm" fw={500}>Border Radius</Text>
                <Field name="borderRadius">
                    <NumberInput
                        min={0}
                        max={50}
                        suffix="px"
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>
        </>
    );
};

export default ExampleContainerBlockSettings;
