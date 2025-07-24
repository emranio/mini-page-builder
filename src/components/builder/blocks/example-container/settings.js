import React, { useEffect } from 'react';
import { Form, InputNumber, Select } from 'antd';
import { BaseSettings } from '../../commons/block';

const { Option } = Select;

const ExampleContainerBlockSettings = ({
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
            padding: element.props?.padding || 10,
            margin: element.props?.margin || 5,
            backgroundColor: element.props?.backgroundColor || 'transparent',
            borderStyle: element.props?.borderStyle || 'dashed',
            borderWidth: element.props?.borderWidth || 1,
            borderColor: element.props?.borderColor || '#d9d9d9',
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
            title="Container Settings"
            open={open}
            onCancel={onClose}
            form={form}
            initialValues={{
                padding: element.props?.padding || 10,
                margin: element.props?.margin || 5,
                backgroundColor: element.props?.backgroundColor || 'transparent',
                borderStyle: element.props?.borderStyle || 'dashed',
                borderWidth: element.props?.borderWidth || 1,
                borderColor: element.props?.borderColor || '#d9d9d9',
                borderRadius: element.props?.borderRadius || 0
            }}
            onValuesChange={handleValuesChange}
            width={500}
            inline={inline}
        >
            <Form.Item
                label="Padding"
                name="padding"
            >
                <InputNumber
                    min={0}
                    max={50}
                    addonAfter="px"
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item
                label="Margin"
                name="margin"
            >
                <InputNumber
                    min={0}
                    max={50}
                    addonAfter="px"
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item
                label="Background Color"
                name="backgroundColor"
            >
                <Select style={{ width: '100%' }}>
                    <Option value="transparent">Transparent</Option>
                    <Option value="#ffffff">White</Option>
                    <Option value="#f0f0f0">Light Gray</Option>
                    <Option value="#e8e8e8">Gray</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Border Style"
                name="borderStyle"
            >
                <Select style={{ width: '100%' }}>
                    <Option value="none">None</Option>
                    <Option value="solid">Solid</Option>
                    <Option value="dashed">Dashed</Option>
                    <Option value="dotted">Dotted</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Border Width"
                name="borderWidth"
            >
                <InputNumber
                    min={0}
                    max={10}
                    addonAfter="px"
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item
                label="Border Color"
                name="borderColor"
            >
                <input
                    type="color"
                    style={{
                        width: '100%',
                        height: 32,
                        border: '1px solid #d9d9d9'
                    }}
                    onChange={(e) => {
                        form.setFieldsValue({ borderColor: e.target.value });
                        const allValues = form.getFieldsValue();
                        handleValuesChange({ borderColor: e.target.value }, allValues);
                    }}
                />
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
        </BaseSettings>
    );
};

export default ExampleContainerBlockSettings;
