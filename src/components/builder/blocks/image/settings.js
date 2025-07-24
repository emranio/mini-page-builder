import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Image } from 'antd';
import { BaseSettings } from '../../commons/base';

const ImageBlockSettings = ({
    open,
    onClose,
    element,
    throttledUpdate,
    inline = false
}) => {
    const [form] = Form.useForm();

    // Update form values when element props change
    useEffect(() => {
        const newValues = {
            src: element.props?.src || 'https://placehold.co/200x50?text=click+to+edit&font=roboto',
            alt: element.props?.alt || 'Image',
            width: element.props?.width || '100%',
            height: element.props?.height || 'auto',
            borderRadius: element.props?.borderRadius || 0
        };
        form.setFieldsValue(newValues);
    }, [form, element.props]);

    const handleValuesChange = (changedValues, allValues) => {
        // Live update the element as user changes settings
        throttledUpdate(element.id, allValues);
    };

    return (
        <BaseSettings
            title="Image Settings"
            open={open}
            onCancel={onClose}
            form={form}
            initialValues={{
                src: element.props?.src || 'https://placehold.co/200x50?text=click+to+edit&font=roboto',
                alt: element.props?.alt || 'Image',
                width: element.props?.width || '100%',
                height: element.props?.height || 'auto',
                borderRadius: element.props?.borderRadius || 0
            }}
            onValuesChange={handleValuesChange}
            width={600}
            inline={inline}
        >
            <Form.Item
                label="Image URL"
                name="src"
                rules={[{ required: true, message: 'Please enter image URL' }]}
            >
                <Input placeholder="Enter image URL" />
            </Form.Item>

            <Form.Item
                label="Alt Text"
                name="alt"
                rules={[{ required: true, message: 'Please enter alternative text' }]}
            >
                <Input placeholder="Enter alternative text for accessibility" />
            </Form.Item>

            <Form.Item
                label="Width"
                name="width"
            >
                <Input placeholder="e.g., 100%, 200px" />
            </Form.Item>

            <Form.Item
                label="Height"
                name="height"
            >
                <Input placeholder="e.g., auto, 100px" />
            </Form.Item>

            <Form.Item
                label="Border Radius"
                name="borderRadius"
            >
                <InputNumber
                    min={0}
                    max={50}
                    addonAfter="px"
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item shouldUpdate>
                {() => {
                    const src = form.getFieldValue('src');
                    const alt = form.getFieldValue('alt');
                    const width = form.getFieldValue('width');
                    const height = form.getFieldValue('height');
                    const borderRadius = form.getFieldValue('borderRadius');

                    return (
                        <div>
                            <label style={{ fontWeight: 'bold', marginBottom: 8, display: 'block' }}>
                                Preview:
                            </label>
                            <div style={{
                                border: '1px solid #e8e8e8',
                                padding: 16,
                                borderRadius: 4,
                                maxHeight: 300,
                                overflow: 'hidden'
                            }}>
                                <Image
                                    src={src}
                                    alt={alt}
                                    preview={false}
                                    style={{
                                        width: width === '100%' ? '100%' : width,
                                        height,
                                        borderRadius: `${borderRadius || 0}px`,
                                        maxWidth: '100%'
                                    }}
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGhpYGBdgVJZlJiXqFyYm5OZhKYlp1aVJIZmKJZWJSfLFJaxNBLOSsQixdgLMJMkhoKkJpUkpVaWJKzQGj0AY93EZOUJMNCgjGXUKjJ4CYuPFJUJ8GAYc4bMQPKTcwzwgmMAWG8iwmGMTgGJdMN6mq3iQb9LnllZi02//9PQGYJQGAFnFVnTrFWZyKjjpXyOWD7jFFEfKJJKMg/8MDe2Dj1nqfJHO0MDgVmT/+sWNP//1MhG2+f/3yNTw/6N/j/TfHfGgAHlgEBnRsOdwAAAQ"
                                />
                            </div>
                        </div>
                    );
                }}
            </Form.Item>
        </BaseSettings>
    );
};

export default ImageBlockSettings;
