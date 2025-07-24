import React, { useEffect, useState } from 'react';
import { Form, Input, Select, InputNumber, Button, List } from 'antd';
import { PlusOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BaseSettings } from '../../commons/base';

const { Option } = Select;

// Sortable Tab Item Component
const SortableTabItem = ({ tab, index, onTitleChange, onDelete, isDeleteDisabled }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: tab.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="sortable-tab-item"
        >
            <List.Item
                actions={[

                ]}
                style={{
                    padding: '8px 12px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    marginBottom: '4px',
                    backgroundColor: isDragging ? '#f0f0f0' : '#fff',
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
            >
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                        {...attributes}
                        {...listeners}
                        style={{
                            cursor: 'grab',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <HolderOutlined style={{ color: '#8c8c8c' }} />
                    </div>
                    <Input
                        value={tab.title}
                        onChange={(e) => onTitleChange(index, e.target.value)}
                        placeholder="Tab title"
                        style={{ flex: 1 }}
                        size="small"
                    />
                    <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(index)}
                        disabled={isDeleteDisabled}
                        danger
                        title="Delete tab"
                    />
                </div>
            </List.Item>
        </div>
    );
};

const TabsBlockSettings = ({
    open,
    onClose,
    element,
    throttledUpdate,
    inline = false
}) => {
    const [form] = Form.useForm();
    const [tabItems, setTabItems] = useState([]);

    const tabs = element.props?.tabs || [
        { id: 'tab1', title: 'Tab 1' },
        { id: 'tab2', title: 'Tab 2' }
    ];

    // Initialize tab items state
    useEffect(() => {
        setTabItems(tabs);
    }, [element.props?.tabs, tabs]);

    // Sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Update form values when element props change
    useEffect(() => {
        const newValues = {
            tabs: tabItems,
            activeTabId: element.props?.activeTabId || tabItems[0]?.id || '',
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
    }, [form, element.props, tabItems]);

    const handleValuesChange = (changedValues, allValues) => {
        // Live update the element as user changes settings
        throttledUpdate(element.id, changedValues);
    };

    // Handle drag end
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = tabItems.findIndex((item) => item.id === active.id);
            const newIndex = tabItems.findIndex((item) => item.id === over.id);

            const newTabItems = arrayMove(tabItems, oldIndex, newIndex);
            setTabItems(newTabItems);

            // Also reorder the corresponding tabIds to preserve content
            const currentTabIds = element.props?.tabIds || [];
            const newTabIds = arrayMove(currentTabIds, oldIndex, newIndex);

            form.setFieldsValue({ tabs: newTabItems });
            const allValues = form.getFieldsValue();
            allValues.tabs = newTabItems;

            // Include tabIds in the update to preserve container content
            handleValuesChange({ tabs: newTabItems, tabIds: newTabIds }, allValues);
        }
    };

    // Add new tab
    const handleAddTab = () => {
        const newTabId = `tab${Date.now()}`;
        const currentTabs = form.getFieldValue('tabs') || tabs;
        const newTabs = [...currentTabs, { id: newTabId, title: `Tab ${currentTabs.length + 1}` }];

        setTabItems(newTabs);
        form.setFieldsValue({ tabs: newTabs });
        const allValues = form.getFieldsValue();
        allValues.tabs = newTabs;
        handleValuesChange({ tabs: newTabs }, allValues);
    };

    // Delete tab
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

        setTabItems(newTabs);
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

        setTabItems(newTabs);
        form.setFieldsValue({ tabs: newTabs });
        const allValues = form.getFieldsValue();
        allValues.tabs = newTabs;
        handleValuesChange({ tabs: newTabs }, allValues);
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
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={formTabs.map(tab => tab.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div style={{ minHeight: '100px' }}>
                                        {formTabs.map((tab, index) => (
                                            <SortableTabItem
                                                key={tab.id}
                                                tab={tab}
                                                index={index}
                                                onTitleChange={handleTabTitleChange}
                                                onDelete={handleDeleteTab}
                                                isDeleteDisabled={formTabs.length <= 1}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
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
            <Form.Item
                label="Tab Style"
                name="tabStyle"
            >
                <Select style={{ width: '100%' }}>
                    <Option value="default">Default</Option>
                    <Option value="card">Card</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Tab Position"
                name="tabPosition"
            >
                <Select style={{ width: '100%' }}>
                    <Option value="top">Top</Option>
                    <Option value="left">Left</Option>
                    <Option value="right">Right</Option>
                </Select>
            </Form.Item>

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
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Select style={{ flex: 1 }}>
                        <Option value="transparent">Transparent</Option>
                        <Option value="#ffffff">White</Option>
                        <Option value="#f0f0f0">Light Gray</Option>
                        <Option value="#e8e8e8">Gray</Option>
                        <Option value="custom">Custom Color</Option>
                    </Select>
                    <Input
                        type="color"
                        style={{
                            width: 50,
                            height: 32,
                            border: '1px solid #d9d9d9',
                            padding: 0
                        }}
                        placeholder="Custom"
                    />
                </div>
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
                <Input
                    type="color"
                    style={{
                        width: '100%',
                        height: 32,
                        border: '1px solid #d9d9d9',
                        padding: 0
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

export default TabsBlockSettings;
