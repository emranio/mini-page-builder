import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

/**
 * TextBlockSettingsForm - Simplified settings form component
 * All common functionality (form handling, memo, initial values) is handled by BlockFactory
 */
const TextBlockSettingsForm = ({ form, element, initialValues }) => {
    return (
        <>
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

            <Form.Item
                label="Font Size"
                name="fontSize"
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
            >
                <Select style={{ width: '100%' }}>
                    <Option value="normal">Normal</Option>
                    <Option value="bold">Bold</Option>
                    <Option value="lighter">Light</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Text Color"
                name="color"
            >
                <Input
                    type="color"
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item
                label="Text Align"
                name="textAlign"
            >
                <Select style={{ width: '100%' }}>
                    <Option value="left">Left</Option>
                    <Option value="center">Center</Option>
                    <Option value="right">Right</Option>
                    <Option value="justify">Justify</Option>
                </Select>
            </Form.Item>
        </>
    );
};

export default TextBlockSettingsForm;
