/**
 * Demo component showing how to use the global builder component functions
 * This component can be used anywhere in the app to access canvas components
 */

import React, { useState } from 'react';
import { Card, Button, Select, Typography, Space, Divider } from 'antd';
import { useBuilderComponents } from '../../utils/builderComponents';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const BuilderComponentsDemo = () => {
    const {
        getAllComponents,
        getContentComponents,
        getLayoutComponents,
        getFieldComponents,
        getDesignComponents,
        getComponentsByType
    } = useBuilderComponents();

    const [format, setFormat] = useState('nested');
    const [includeLayout, setIncludeLayout] = useState(true);
    const [selectedDemo, setSelectedDemo] = useState('all');

    const getDemoData = () => {
        switch (selectedDemo) {
            case 'all':
                return getAllComponents({ format, includeLayout });
            case 'content':
                return getContentComponents({ format });
            case 'layout':
                return getLayoutComponents({ format });
            case 'field':
                return getFieldComponents({ format });
            case 'design':
                return getDesignComponents({ format });
            case 'by-type-layout':
                return getComponentsByType('layout', { format });
            case 'by-type-field':
                return getComponentsByType('field', { format });
            case 'by-type-design':
                return getComponentsByType('design', { format });
            default:
                return [];
        }
    };

    const demoData = getDemoData();

    return (
        <Card title="Builder Components API Demo" style={{ margin: '20px' }}>
            <Paragraph>
                This demo shows how to access all components that have been added to the right panel (canvas).
                You can filter by format and block types.
            </Paragraph>

            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {/* Controls */}
                <Card size="small" title="Controls">
                    <Space wrap>
                        <div>
                            <Text strong>Demo Type: </Text>
                            <Select
                                value={selectedDemo}
                                onChange={setSelectedDemo}
                                style={{ width: 200 }}
                            >
                                <Option value="all">All Components</Option>
                                <Option value="content">Content Only (No Layout)</Option>
                                <Option value="layout">Layout Components</Option>
                                <Option value="field">Field Components</Option>
                                <Option value="design">Design Components</Option>
                                <Option value="by-type-layout">By Type: Layout</Option>
                                <Option value="by-type-field">By Type: Field</Option>
                                <Option value="by-type-design">By Type: Design</Option>
                            </Select>
                        </div>

                        <div>
                            <Text strong>Format: </Text>
                            <Select
                                value={format}
                                onChange={setFormat}
                                style={{ width: 120 }}
                            >
                                <Option value="nested">Nested</Option>
                                <Option value="flat">Flat</Option>
                            </Select>
                        </div>

                        {selectedDemo === 'all' && (
                            <div>
                                <Text strong>Include Layout: </Text>
                                <Select
                                    value={includeLayout}
                                    onChange={setIncludeLayout}
                                    style={{ width: 100 }}
                                >
                                    <Option value={true}>Yes</Option>
                                    <Option value={false}>No</Option>
                                </Select>
                            </div>
                        )}
                    </Space>
                </Card>

                {/* Results */}
                <Card size="small" title={`Results (${demoData.length} components)`}>
                    <div style={{
                        backgroundColor: '#f5f5f5',
                        padding: '16px',
                        borderRadius: '4px',
                        maxHeight: '400px',
                        overflow: 'auto'
                    }}>
                        <pre style={{ margin: 0, fontSize: '12px' }}>
                            {JSON.stringify(demoData, null, 2)}
                        </pre>
                    </div>
                </Card>

                {/* Usage Examples */}
                <Card size="small" title="Usage Examples">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                            <Text strong>Get all components (nested with layout):</Text>
                            <pre style={{ backgroundColor: '#f0f0f0', padding: '8px', margin: '4px 0' }}>
                                {`const { getAllComponents } = useBuilderComponents();
const allComponents = getAllComponents();`}
                            </pre>
                        </div>

                        <div>
                            <Text strong>Get content components as flat array:</Text>
                            <pre style={{ backgroundColor: '#f0f0f0', padding: '8px', margin: '4px 0' }}>
                                {`const { getContentComponents } = useBuilderComponents();
const contentFlat = getContentComponents({ format: 'flat' });`}
                            </pre>
                        </div>

                        <div>
                            <Text strong>Get only field components:</Text>
                            <pre style={{ backgroundColor: '#f0f0f0', padding: '8px', margin: '4px 0' }}>
                                {`const { getFieldComponents } = useBuilderComponents();
const fieldComponents = getFieldComponents();`}
                            </pre>
                        </div>

                        <div>
                            <Text strong>Get specific block type:</Text>
                            <pre style={{ backgroundColor: '#f0f0f0', padding: '8px', margin: '4px 0' }}>
                                {`const { getComponentsByType } = useBuilderComponents();
const layoutComponents = getComponentsByType('layout', { format: 'flat' });`}
                            </pre>
                        </div>
                    </Space>
                </Card>

                {/* Block Types Reference */}
                <Card size="small" title="Block Types Reference">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                            <Text strong>Layout Blocks:</Text>
                            <Text> tabs, example-container, column</Text>
                        </div>
                        <div>
                            <Text strong>Field Blocks:</Text>
                            <Text> text (content input elements)</Text>
                        </div>
                        <div>
                            <Text strong>Design Blocks:</Text>
                            <Text> image (visual/media elements)</Text>
                        </div>
                    </Space>
                </Card>
            </Space>
        </Card>
    );
};

export default BuilderComponentsDemo;
