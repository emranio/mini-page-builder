import React, { useEffect } from 'react';
import { Form, Input, Select, InputNumber, Space, Button, List, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { BaseSettings } from '../base';

const { Option } = Select;

const TabsBlockSettings = ({
    open,
    onClose,
    element,
    throttledUpdate,
    inline = false
}) => {
    const [form] = Form.useForm();
    const tabs = element.props?.tabs || [
        { id: 'tab1', title: 'Tab 1' },
        { id: 'tab2', title: 'Tab 2' }
    ];

    // Update form values when element props change
    useEffect(() => {
        const newValues = {
            tabs: tabs,
            activeTabId: element.props?.activeTabId || tabs[0]?.id || '',
            backgroundColor: element.props?.backgroundColor || 'transparent',
            borderStyle: element.props?.borderStyle || 'solid',
            borderWidth: element.props?.borderWidth || 1,
            borderColor: element.props?.borderColor || '#d9d9d9',
            borderRadius: element.props?.borderRadius || 4,
            padding: element.props?.padding || 10,
            tabStyle: element.props?.tabStyle || 'default',
            tabPosition: element.props?.tabPosition || 'top'
        };
        form.setFieldsValue(newValues);
    }, [form, element.props]);

    const handleValuesChange = (changedValues, allValues) => {
        // Live update the element as user changes settings
        throttledUpdate(element.id, allValues);
    };

    // Add new tab
    const handleAddTab = () => {
        const newTabId = `tab${Date.now()}`;
        const currentTabs = form.getFieldValue('tabs') || tabs;
        const newTabs = [...currentTabs, { id: newTabId, title: `Tab ${currentTabs.length + 1}` }];

        form.setFieldsValue({ tabs: newTabs });
        const allValues = form.getFieldsValue();
        allValues.tabs = newTabs;
        handleValuesChange({ tabs: newTabs }, allValues);
    };    // Delete tab
    const handleDeleteTab = (index) => {
        const currentTabs = form.getFieldValue('tabs') || tabs;
        if (currentTabs.length <= 1) return; // Don't delete if it's the last tab

        const newTabs = currentTabs.filter((_, i) => i !== index);
        const currentActiveTab = form.getFieldValue('activeTabId');
        const deletedTab = currentTabs[index];

        // If we're deleting the active tab, switch to the first remaining tab
        let newActiveTab = currentActiveTab;
        if (deletedTab.id === currentActiveTab) {
            newActiveTab = newTabs[0]?.id || '';
        }

        // Also handle the tabIds array - remove the container ID at the same index
        const currentTabIds = element.props?.tabIds || [];
        const newTabIds = currentTabIds.filter((_, i) => i !== index);

        form.setFieldsValue({
            tabs: newTabs,
            activeTabId: newActiveTab
        });

        const allValues = form.getFieldsValue();
        allValues.tabs = newTabs;
        allValues.activeTabId = newActiveTab;

        // Include the updated tabIds in the update to trigger proper cleanup
        handleValuesChange({
            tabs: newTabs,
            activeTabId: newActiveTab,
            tabIds: newTabIds
        }, allValues);
    };

    // Update tab title
    const handleTabTitleChange = (index, newTitle) => {
        const currentTabs = form.getFieldValue('tabs') || tabs;
        const newTabs = currentTabs.map((tab, i) =>
            i === index ? { ...tab, title: newTitle } : tab
        );

        form.setFieldsValue({ tabs: newTabs });
        const allValues = form.getFieldsValue();
        allValues.tabs = newTabs;
        handleValuesChange({ tabs: newTabs }, allValues);
    };

    // Move tab up
    const handleMoveTabUp = (index) => {
        if (index === 0) return; // Can't move first tab up

        const currentTabs = form.getFieldValue('tabs') || tabs;
        const newTabs = [...currentTabs];

        // Swap with previous tab
        [newTabs[index - 1], newTabs[index]] = [newTabs[index], newTabs[index - 1]];

        // Also reorder the corresponding tabIds to preserve content
        const currentTabIds = element.props?.tabIds || [];
        const newTabIds = [...currentTabIds];
        if (newTabIds.length > index) {
            [newTabIds[index - 1], newTabIds[index]] = [newTabIds[index], newTabIds[index - 1]];
        }

        form.setFieldsValue({ tabs: newTabs });
        const allValues = form.getFieldsValue();
        allValues.tabs = newTabs;

        // Include tabIds in the update to preserve container content
        handleValuesChange({ tabs: newTabs, tabIds: newTabIds }, allValues);
    };

    // Move tab down
    const handleMoveTabDown = (index) => {
        const currentTabs = form.getFieldValue('tabs') || tabs;
        if (index === currentTabs.length - 1) return; // Can't move last tab down

        const newTabs = [...currentTabs];

        // Swap with next tab
        [newTabs[index], newTabs[index + 1]] = [newTabs[index + 1], newTabs[index]];

        // Also reorder the corresponding tabIds to preserve content
        const currentTabIds = element.props?.tabIds || [];
        const newTabIds = [...currentTabIds];
        if (newTabIds.length > index + 1) {
            [newTabIds[index], newTabIds[index + 1]] = [newTabIds[index + 1], newTabIds[index]];
        }

        form.setFieldsValue({ tabs: newTabs });
        const allValues = form.getFieldsValue();
        allValues.tabs = newTabs;

        // Include tabIds in the update to preserve container content
        handleValuesChange({ tabs: newTabs, tabIds: newTabIds }, allValues);
    };

    return (
        <BaseSettings
            title="Tabs Settings"
            open={open}
            onCancel={onClose}
            form={form}
            initialValues={{
                tabs: tabs,
                activeTabId: element.props?.activeTabId || tabs[0]?.id || '',
                backgroundColor: element.props?.backgroundColor || 'transparent',
                borderStyle: element.props?.borderStyle || 'solid',
                borderWidth: element.props?.borderWidth || 1,
                borderColor: element.props?.borderColor || '#d9d9d9',
                borderRadius: element.props?.borderRadius || 4,
                padding: element.props?.padding || 10,
                tabStyle: element.props?.tabStyle || 'default',
                tabPosition: element.props?.tabPosition || 'top'
            }}
            onValuesChange={handleValuesChange}
            width={600}
            inline={inline}
        >
            {/* Tab Management */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500 }}>Manage Tabs</span>
                    <Button
                        type="dashed"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={handleAddTab}
                    >
                        Add Tab
                    </Button>
                </div>

                <Form.Item shouldUpdate>
                    {() => {
                        const formTabs = form.getFieldValue('tabs') || tabs;
                        return (
                            <List
                                size="small"
                                dataSource={formTabs}
                                renderItem={(tab, index) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<UpOutlined />}
                                                onClick={() => handleMoveTabUp(index)}
                                                disabled={index === 0}
                                                title="Move up"
                                            />,
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<DownOutlined />}
                                                onClick={() => handleMoveTabDown(index)}
                                                disabled={index === formTabs.length - 1}
                                                title="Move down"
                                            />,
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleDeleteTab(index)}
                                                disabled={formTabs.length <= 1}
                                                danger
                                                title="Delete tab"
                                            />
                                        ]}
                                        style={{
                                            padding: '8px 12px',
                                            border: '1px solid #f0f0f0',
                                            borderRadius: '4px',
                                            marginBottom: '4px'
                                        }}
                                    >
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <EditOutlined style={{ color: '#8c8c8c' }} />
                                            <Input
                                                value={tab.title}
                                                onChange={(e) => handleTabTitleChange(index, e.target.value)}
                                                placeholder="Tab title"
                                                style={{ flex: 1 }}
                                                size="small"
                                            />
                                        </div>
                                    </List.Item>
                                )}
                            />
                        );
                    }}
                </Form.Item>
            </div>

            {/* Active Tab */}
            <Form.Item shouldUpdate>
                {() => {
                    const formTabs = form.getFieldValue('tabs') || tabs;
                    return (
                        <Form.Item
                            label="Default Active Tab"
                            name="activeTabId"
                        >
                            <Select style={{ width: '100%' }}>
                                {formTabs.map(tab => (
                                    <Option key={tab.id} value={tab.id}>
                                        {tab.title}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    );
                }}
            </Form.Item>

            {/* Tab Appearance */}
            <Space.Compact block>
                <Form.Item
                    label="Tab Style"
                    name="tabStyle"
                    style={{ flex: 1 }}
                >
                    <Select style={{ width: '100%' }}>
                        <Option value="default">Default</Option>
                        <Option value="card">Card</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Tab Position"
                    name="tabPosition"
                    style={{ flex: 1, marginLeft: 8 }}
                >
                    <Select style={{ width: '100%' }}>
                        <Option value="top">Top</Option>
                        <Option value="bottom">Bottom</Option>
                        <Option value="left">Left</Option>
                        <Option value="right">Right</Option>
                    </Select>
                </Form.Item>
            </Space.Compact>

            {/* Container Styling */}
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

            <Space.Compact block>
                <Form.Item
                    label="Border Color"
                    name="borderColor"
                    style={{ flex: 1 }}
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
                    style={{ flex: 1, marginLeft: 8 }}
                >
                    <InputNumber
                        min={0}
                        max={50}
                        addonAfter="px"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            </Space.Compact>
        </BaseSettings>
    );
};

export default TabsBlockSettings;
