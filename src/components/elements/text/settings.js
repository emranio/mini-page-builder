import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Space } from 'antd';
import { BaseSettings } from '../base';

const { TextArea } = Input;
const { Option } = Select;

const TextElementSettings = ({
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
            content: element.props?.content || 'Click to edit text',
            fontSize: element.props?.fontSize || 14,
            fontWeight: element.props?.fontWeight || 'normal',
            color: element.props?.color || '#000000',
            textAlign: element.props?.textAlign || 'left'
        };
        form.setFieldsValue(newValues);
    }, [form, element.props]);

    const handleValuesChange = (changedValues, allValues) => {
        // Live update the element as user changes settings
        console.log("Settings form changed:", changedValues, "source=settings");

        // If we're editing content in the settings panel, use a separate update method
        // to avoid triggering UI changes in the canvas view
        if (changedValues.hasOwnProperty('content')) {
            // Add a small delay to batch content updates from typing
            if (window.textSettingsTimeout) {
                clearTimeout(window.textSettingsTimeout);
            }

            window.textSettingsTimeout = setTimeout(() => {
                throttledUpdate(element.id, allValues);
                window.textSettingsTimeout = null;
            }, 500); // 500ms delay for content updates
        } else {
            // For other properties, update immediately
            throttledUpdate(element.id, allValues);
        }
    };

    // Clean up the timeout when component unmounts
    useEffect(() => {
        return () => {
            if (window.textSettingsTimeout) {
                clearTimeout(window.textSettingsTimeout);
                window.textSettingsTimeout = null;
            }
        };
    }, []);

    return (
        <BaseSettings
            title="Text Settings"
            open={open}
            onCancel={onClose}
            form={form}
            initialValues={{
                content: element.props?.content || 'Click to edit text',
                fontSize: element.props?.fontSize || 14,
                fontWeight: element.props?.fontWeight || 'normal',
                color: element.props?.color || '#000000',
                textAlign: element.props?.textAlign || 'left'
            }}
            onValuesChange={handleValuesChange}
            width={500}
            inline={inline}
        >
            <Form.Item
                label="Content"
                name="content"
                rules={[{ required: true, message: 'Please enter text content' }]}
            >
                <TextArea
                    rows={4}
                    placeholder="Enter your text content"
                />
            </Form.Item>

            <Space.Compact block>
                <Form.Item
                    label="Font Size"
                    name="fontSize"
                    style={{ flex: 1 }}
                >
                    <InputNumber
                        min={8}
                        max={72}
                        addonAfter="px"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    label="Font Weight"
                    name="fontWeight"
                    style={{ flex: 1, marginLeft: 8 }}
                >
                    <Select style={{ width: '100%' }}>
                        <Option value="normal">Normal</Option>
                        <Option value="bold">Bold</Option>
                        <Option value="lighter">Light</Option>
                    </Select>
                </Form.Item>
            </Space.Compact>

            <Space.Compact block>
                <Form.Item
                    label="Text Color"
                    name="color"
                    style={{ flex: 1 }}
                >
                    <Input
                        type="color"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    label="Text Align"
                    name="textAlign"
                    style={{ flex: 1, marginLeft: 8 }}
                >
                    <Select style={{ width: '100%' }}>
                        <Option value="left">Left</Option>
                        <Option value="center">Center</Option>
                        <Option value="right">Right</Option>
                        <Option value="justify">Justify</Option>
                    </Select>
                </Form.Item>
            </Space.Compact>
        </BaseSettings>
    );
};

export default TextElementSettings;
