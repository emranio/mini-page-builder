import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, List } from 'antd';
import { PlusOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
                style={{
                    padding: '8px 12px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    marginBottom: '4px',
                    backgroundColor: isDragging ? '#f0f0f0' : '#fff',
                    cursor: isDragging ? 'grabbing' : 'default'
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

/**
 * TabsBlockSettings - Enhanced form component for new architecture
 * Includes special tab management functionality (add/edit/delete/reorder)
 */
const TabsBlockSettings = ({ form, element, initialValues, throttledUpdate }) => {
    const [tabItems, setTabItems] = useState([]);

    const tabs = element?.props?.tabs || [];

    // Initialize tab items state
    useEffect(() => {
        setTabItems(tabs);
    }, [tabs]);

    // Set up sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const triggerBlockUpdate = (newTabs) => {
        // Update local state
        setTabItems(newTabs);

        // Update form values
        form.setFieldsValue({ tabs: newTabs });

        // Get all current form values and update the block
        const allValues = { ...form.getFieldsValue(), tabs: newTabs };
        throttledUpdate(element.id, allValues);
    };

    const handleTabTitleChange = (index, newTitle) => {
        const newTabs = [...tabItems];
        newTabs[index] = { ...newTabs[index], title: newTitle };
        triggerBlockUpdate(newTabs);
    };

    const handleAddTab = () => {
        const newTabId = `tab${Date.now()}`;
        const newTabs = [...tabItems, { id: newTabId, title: `Tab ${tabItems.length + 1}` }];
        triggerBlockUpdate(newTabs);
    };

    const handleDeleteTab = (index) => {
        if (tabItems.length <= 1) return; // Don't allow deleting the last tab

        const newTabs = tabItems.filter((_, i) => i !== index);
        triggerBlockUpdate(newTabs);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = tabItems.findIndex(item => item.id === active.id);
            const newIndex = tabItems.findIndex(item => item.id === over.id);

            const reorderedTabs = arrayMove(tabItems, oldIndex, newIndex);
            triggerBlockUpdate(reorderedTabs);
        }
    };

    return (
        <>
            <Form.Item label="Tabs">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={tabItems.map(tab => tab.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div style={{ marginBottom: '8px' }}>
                            {tabItems.map((tab, index) => (
                                <SortableTabItem
                                    key={tab.id}
                                    tab={tab}
                                    index={index}
                                    onTitleChange={handleTabTitleChange}
                                    onDelete={handleDeleteTab}
                                    isDeleteDisabled={tabItems.length <= 1}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <Button
                    type="dashed"
                    onClick={handleAddTab}
                    icon={<PlusOutlined />}
                    style={{ width: '100%' }}
                >
                    Add Tab
                </Button>
            </Form.Item>

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
                    <Option value="bottom">Bottom</Option>
                    <Option value="left">Left</Option>
                    <Option value="right">Right</Option>
                </Select>
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
        </>
    );
};

export default TabsBlockSettings;
