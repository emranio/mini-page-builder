import React, { useState, useEffect } from 'react';
import { TextInput, Select, NumberInput, Button, Stack, Text, ActionIcon, Group } from '@mantine/core';
import IconGripVertical from '@tabler/icons-react/dist/esm/icons/IconGripVertical';
import IconTrash from '@tabler/icons-react/dist/esm/icons/IconTrash';
import IconPlus from '@tabler/icons-react/dist/esm/icons/IconPlus';
import { Field } from 'rc-field-form';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
            <Group
                spacing="xs"
                style={{
                    padding: '8px 12px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    marginBottom: '4px',
                    backgroundColor: isDragging ? '#f0f0f0' : '#fff',
                    cursor: isDragging ? 'grabbing' : 'default'
                }}
            >
                <ActionIcon
                    {...attributes}
                    {...listeners}
                    variant="subtle"
                    style={{ cursor: 'grab' }}
                >
                    <IconGripVertical size={16} color="#8c8c8c" />
                </ActionIcon>
                <TextInput
                    value={tab.title}
                    onChange={(e) => onTitleChange(index, e.currentTarget.value)}
                    placeholder="Tab title"
                    style={{ flex: 1 }}
                    size="sm"
                />
                <ActionIcon
                    onClick={() => onDelete(index)}
                    disabled={isDeleteDisabled}
                    color="red"
                    variant="subtle"
                    title="Delete tab"
                >
                    <IconTrash size={16} />
                </ActionIcon>
            </Group>
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
            <Stack gap="xs">
                <Text size="sm" fw={500}>Tabs</Text>
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
                    variant="default"
                    onClick={handleAddTab}
                    leftSection={<IconPlus size={16} />}
                    fullWidth
                >
                    Add Tab
                </Button>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Tab Style</Text>
                <Field name="tabStyle">
                    <Select
                        data={[
                            { value: 'default', label: 'Default' },
                            { value: 'card', label: 'Card' }
                        ]}
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Tab Position</Text>
                <Field name="tabPosition">
                    <Select
                        data={[
                            { value: 'top', label: 'Top' },
                            { value: 'bottom', label: 'Bottom' },
                            { value: 'left', label: 'Left' },
                            { value: 'right', label: 'Right' }
                        ]}
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Background Color</Text>
                <Field name="backgroundColor">
                    <Select
                        data={[
                            { value: 'transparent', label: 'Transparent' },
                            { value: '#ffffff', label: 'White' },
                            { value: '#f0f0f0', label: 'Light Gray' },
                            { value: '#e8e8e8', label: 'Gray' }
                        ]}
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Border Style</Text>
                <Field name="borderStyle">
                    <Select
                        data={[
                            { value: 'none', label: 'None' },
                            { value: 'solid', label: 'Solid' },
                            { value: 'dashed', label: 'Dashed' },
                            { value: 'dotted', label: 'Dotted' }
                        ]}
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Border Width</Text>
                <Field name="borderWidth">
                    <NumberInput
                        min={0}
                        max={10}
                        suffix="px"
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Border Color</Text>
                <Field name="borderColor">
                    <input
                        type="color"
                        style={{
                            width: '100%',
                            height: 32,
                            border: '1px solid #d9d9d9'
                        }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Border Radius</Text>
                <Field name="borderRadius">
                    <NumberInput
                        min={0}
                        max={50}
                        suffix="px"
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>

            <Stack gap="xs">
                <Text size="sm" fw={500}>Padding</Text>
                <Field name="padding">
                    <NumberInput
                        min={0}
                        max={50}
                        suffix="px"
                        style={{ width: '100%' }}
                    />
                </Field>
            </Stack>
        </>
    );
};

export default TabsBlockSettings;
