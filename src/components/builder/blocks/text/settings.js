import React, { useEffect, memo, useCallback } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { BaseSettings } from '../../commons/block';

const { Option } = Select;
const { TextArea } = Input;

/**
 * TextBlockSettings component - Optimized with React.memo for performance
 */
const TextBlockSettings = memo(({
    open,
    onClose,
    element,
    throttledUpdate,
    inline = false
}) => {
    const [form] = Form.useForm();

    // Memoize initial values to prevent form recreation
    const initialValues = React.useMemo(() => ({
        content: element.props?.content || 'Simple text block',
        fontSize: element.props?.fontSize || 14,
        fontWeight: element.props?.fontWeight || 'normal',
        color: element.props?.color || '#000000',
        textAlign: element.props?.textAlign || 'left'
    }), [element.props]);

    // Update form values when element props change
    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [form, initialValues]);

    const handleValuesChange = useCallback((changedValues, allValues) => {
        // Live update the element as user changes settings
        throttledUpdate(element.id, allValues);
    }, [throttledUpdate, element.id]);

    return (
        <BaseSettings
            title="Text Settings"
            open={open}
            onCancel={onClose}
            form={form}
            initialValues={initialValues}
            onValuesChange={handleValuesChange}
            width={500}
            inline={inline}
        >
            {/* Only show content editing in the left panel (inline) */}
            {inline && (
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
            )}

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

            {!inline && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <p>Content can be edited from the left panel settings.</p>
                </div>
            )}
        </BaseSettings>
    );
});

export default TextBlockSettings;
