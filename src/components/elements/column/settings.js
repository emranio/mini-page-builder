import React from 'react';
import { Form, Slider, InputNumber, Space, Select } from 'antd';
import { BaseSettings } from '../base';

const { Option } = Select;

const ColumnElementSettings = ({
    open,
    onClose,
    element,
    throttledUpdate,
    inline = false
}) => {
    const [form] = Form.useForm();
    const columns = element.props?.columns || 2;
    const columnWidths = element.props?.columnWidths || [];

    const handleValuesChange = (changedValues, allValues) => {
        // Live update the element as user changes settings
        throttledUpdate(element.id, allValues);
    };

    // Dynamic form items for column widths
    const renderColumnWidthFields = (formColumnCount) => {
        const columnCount = formColumnCount || columns;

        return Array(columnCount).fill(0).map((_, index) => (
            <Form.Item
                key={`width-${index}`}
                label={`Column ${index + 1} Width (%)`}
                name={['columnWidths', index]}
                rules={[{ required: true, message: 'Please input the column width' }]}
            >
                <InputNumber
                    min={5}
                    max={95}
                    addonAfter="%"
                    style={{ width: '100%' }}
                />
            </Form.Item>
        ));
    };

    return (
        <BaseSettings
            title="Column Settings"
            open={open}
            onCancel={onClose}
            form={form}
            initialValues={{
                columns: columns,
                columnWidths: columnWidths.length > 0 ? columnWidths : Array(columns).fill(Math.floor(100 / columns)),
                gap: element.props?.gap || 10,
                backgroundColor: element.props?.backgroundColor || 'transparent',
                borderStyle: element.props?.borderStyle || 'dashed',
                borderWidth: element.props?.borderWidth || 1,
                borderColor: element.props?.borderColor || '#d9d9d9'
            }}
            onValuesChange={handleValuesChange}
            width={600}
            inline={inline}
        >
            <Form.Item
                name="columns"
                label="Number of Columns"
                rules={[{ required: true, message: 'Please select the number of columns' }]}
            >
                <Slider
                    min={2}
                    max={12}
                    marks={{
                        2: '2',
                        4: '4',
                        6: '6',
                        8: '8',
                        10: '10',
                        12: '12'
                    }}
                    onChange={(value) => {
                        // When column count changes, immediately update column widths
                        const equalWidth = Math.floor(100 / value);
                        form.setFieldsValue({
                            columnWidths: Array(value).fill(equalWidth)
                        });
                        // Trigger live update
                        const allValues = form.getFieldsValue();
                        allValues.columnWidths = Array(value).fill(equalWidth);
                        handleValuesChange({ columns: value, columnWidths: allValues.columnWidths }, allValues);
                    }}
                />
            </Form.Item>

            <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.columns !== currentValues.columns}>
                {() => {
                    const formColumnCount = form.getFieldValue('columns') || columns;
                    return (
                        <div className="column-widths-container">
                            {renderColumnWidthFields(formColumnCount)}
                        </div>
                    );
                }}
            </Form.Item>

            <Form.Item>
                <Space>
                    <button
                        type="button"
                        onClick={() => {
                            // Distribute column widths evenly
                            const count = form.getFieldValue('columns');
                            const equalWidth = Math.floor(100 / count);
                            const newWidths = Array(count).fill(equalWidth);
                            form.setFieldsValue({
                                columnWidths: newWidths
                            });
                            // Trigger live update
                            const allValues = form.getFieldsValue();
                            allValues.columnWidths = newWidths;
                            handleValuesChange({ columnWidths: newWidths }, allValues);
                        }}
                        style={{
                            padding: '4px 15px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '6px',
                            background: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        Distribute Evenly
                    </button>
                </Space>
            </Form.Item>

            <Form.Item
                label="Gap Between Columns"
                name="gap"
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
                <Space.Compact style={{ width: '100%' }}>
                    <Select style={{ width: '50%' }}>
                        <Option value="transparent">Transparent</Option>
                        <Option value="#ffffff">White</Option>
                        <Option value="#f0f0f0">Light Gray</Option>
                        <Option value="#e8e8e8">Gray</Option>
                    </Select>
                    <Form.Item name="backgroundColor" noStyle>
                        <input
                            type="color"
                            style={{
                                width: '50%',
                                height: 32,
                                border: '1px solid #d9d9d9',
                                borderLeft: 'none'
                            }}
                            onChange={(e) => {
                                form.setFieldsValue({ backgroundColor: e.target.value });
                                const allValues = form.getFieldsValue();
                                handleValuesChange({ backgroundColor: e.target.value }, allValues);
                            }}
                        />
                    </Form.Item>
                </Space.Compact>
            </Form.Item>

            <Space.Compact block>
                <Form.Item
                    label="Border Style"
                    name="borderStyle"
                    style={{ flex: 1 }}
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
                    style={{ flex: 1, marginLeft: 8 }}
                >
                    <InputNumber
                        min={0}
                        max={10}
                        addonAfter="px"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </Space.Compact>

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
        </BaseSettings>
    );
};

export default ColumnElementSettings;
