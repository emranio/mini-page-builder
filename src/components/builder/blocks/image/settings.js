import React from 'react';
import { TextInput, NumberInput, Stack, Text, Image } from '@mantine/core';
import { Field } from 'rc-field-form';

/**
 * ImageBlockSettings - Form fields for image block configuration
 * This follows the new simplified BlockFactory pattern
 */
const ImageBlockSettings = ({ form, element, initialValues }) => {
    return (
        <>
            <Field
                name="src"
                rules={[{ required: true, message: 'Please enter image URL' }]}
            >
                <Stack gap="xs">
                    <Text size="sm" fw={500}>Image URL</Text>
                    <TextInput
                        placeholder="Enter image URL"
                        style={{ width: '100%' }}
                    />
                </Stack>
            </Field>

            <Field
                name="alt"
                rules={[{ required: true, message: 'Please enter alternative text' }]}
            >
                <Stack gap="xs">
                    <Text size="sm" fw={500}>Alt Text</Text>
                    <TextInput
                        placeholder="Enter alternative text for accessibility"
                        style={{ width: '100%' }}
                    />
                </Stack>
            </Field>

            <Field name="width">
                <Stack gap="xs">
                    <Text size="sm" fw={500}>Width</Text>
                    <TextInput
                        placeholder="e.g., 100%, 200px"
                        style={{ width: '100%' }}
                    />
                </Stack>
            </Field>

            <Field name="height">
                <Stack gap="xs">
                    <Text size="sm" fw={500}>Height</Text>
                    <TextInput
                        placeholder="e.g., auto, 100px"
                        style={{ width: '100%' }}
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

            <Stack gap="xs">
                <Text size="sm" fw={500}>Preview:</Text>
                <div style={{
                    border: '1px solid #e8e8e8',
                    padding: 16,
                    borderRadius: 4,
                    maxHeight: 300,
                    overflow: 'hidden'
                }}>
                    <Image
                        src={form?.getFieldValue('src')}
                        alt={form?.getFieldValue('alt') || 'Image preview'}
                        style={{
                            width: form?.getFieldValue('width') === '100%' ? '100%' : form?.getFieldValue('width'),
                            height: form?.getFieldValue('height'),
                            borderRadius: `${form?.getFieldValue('borderRadius') || 0}px`,
                            maxWidth: '100%'
                        }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGhpYGBdgVJZlJiXqFyYm5OZhKYlp1aVJIZmKJZWJSfLFJaxNBLOSsQixdgLMJMkhoKkJpUkpVaWJKzQGj0AY93EZOUJMNCgjGXUKjJ4CYuPFJUJ8GAYc4bMQPKTcwzwgmMAWG8iwmGMTgGJdMN6mq3iQb9LnllZi02//9PQGYJQGAFnFVnTrFWZyKjjpXyOWD7jFFEfKJJKMg/8MDe2Dj1nqfJHO0MDgVmT/+sWNP//1MhG2+f/3yNTw/6N/j/TfHfGgAHlgEBnRsOdwAAAQ"
                    />
                </div>
            </Stack>
        </>
    );
};

export default ImageBlockSettings;
