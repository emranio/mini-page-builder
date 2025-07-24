import React from 'react';
import { Form, InputNumber, Select } from 'antd';

const { Option } = Select;

/**
 * ExampleContainerBlockSettings - Simplified form component for new architecture
 * Common functionality (form handling, prop defaults) is handled by createBlockSettings factory
 */
const ExampleContainerBlockSettings = ({ form }) => {
    return (
        <>
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
                        form.submit();
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
        </>
    );
};

export default ExampleContainerBlockSettings;
