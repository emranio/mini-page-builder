import React from 'react';
import { Textarea, NumberInput, Select, ColorInput, Stack, Text } from '@mantine/core';
import { Field } from 'rc-field-form';

/**
 * TextBlockSettingsForm - Simplified settings form component
 * All common functionality (form handling, memo, initial values) is handled by BlockFactory
 */
const TextBlockSettingsForm = ({ form, element, initialValues }) => {
    return (
        <>
            <Stack gap="xs">
                <Text size="sm" fw={500}>Content</Text>
                <Field
                    name="content"
                    rules={[{ required: true, message: 'Please enter text content' }]}
                >
                    <Textarea
                        rows={4}
                        placeholder="Enter your text content"
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Font Size</Text>
                <Field name="fontSize">
                    <NumberInput
                        min={8}
                        max={72}
                        suffix="px"
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Font Weight</Text>
                <Field name="fontWeight">
                    <Select
                        data={[
                            { value: 'normal', label: 'Normal' },
                            { value: 'bold', label: 'Bold' },
                            { value: 'lighter', label: 'Light' }
                        ]}
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Text Color</Text>
                <Field name="color">
                    <ColorInput
                        format="hex"
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Text Align</Text>
                <Field name="textAlign">
                    <Select
                        data={[
                            { value: 'left', label: 'Left' },
                            { value: 'center', label: 'Center' },
                            { value: 'right', label: 'Right' },
                            { value: 'justify', label: 'Justify' }
                        ]}
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>
        </>
    );
};

export default TextBlockSettingsForm;
