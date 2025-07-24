import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { BaseSettings } from '../../commons/base';

const { Option } = Select;

const TextBlockSettings = ({
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
            fontSize: element.props?.fontSize || 14,
            fontWeight: element.props?.fontWeight || 'normal',
            color: element.props?.color || '#000000',
            textAlign: element.props?.textAlign || 'left'
        };
        form.setFieldsValue(newValues);
    }, [form, element.props]);

    const handleValuesChange = (changedValues, allValues) => {
        // Live update the element as user changes settings
        throttledUpdate(element.id, allValues);
    };

    return (
        <BaseSettings
            title="Text Settings"
            open={open}
            onCancel={onClose}
            form={form}
            initialValues={{
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

            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <p>This is a simplified text block. Content is not editable in the settings panel.</p>
            </div>
        </BaseSettings>
    );
};

export default TextBlockSettings;
