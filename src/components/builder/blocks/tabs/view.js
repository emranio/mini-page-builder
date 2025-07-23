import React, { useState, useEffect } from 'react';
import { Tabs, Button, Dropdown, Menu } from 'antd';
import { PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useBuilder } from '../../../../contexts/BuilderContext';
import { DropZone } from '../commons';
import { withBaseElement } from '../base';

const TabsBlockView = ({
    id,
    tabs = [
        { id: 'tab1', title: 'Tab 1' },
        { id: 'tab2', title: 'Tab 2' }
    ],
    activeTabId = 'tab1',
    tabIds = [],
    backgroundColor = 'transparent',
    borderStyle = 'solid',
    borderWidth = 1,
    borderColor = '#d9d9d9',
    borderRadius = 4,
    padding = 10,
    tabStyle = 'default',
    tabPosition = 'top',
    throttledUpdate
}) => {
    const { updateBlock, createBlock, getBlockById, isDragging, setSelectedBlockId, deleteBlock } = useBuilder();
    const [currentActiveTab, setCurrentActiveTab] = useState(activeTabId);
    const [editingTabId, setEditingTabId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedBlockId(id);
    };

    // Initialize tab containers if they don't exist
    useEffect(() => {
        const block = getBlockById(id);
        const currentTabIds = block?.props?.tabIds || [];
        const currentTabs = block?.props?.tabs || tabs;

        // If we don't have tab containers or the number of tabs changed, create/update them
        if (currentTabIds.length !== currentTabs.length) {
            const newTabIds = [...currentTabIds];

            // If we need more containers, create them
            if (currentTabIds.length < currentTabs.length) {
                for (let i = currentTabIds.length; i < currentTabs.length; i++) {
                    const tabContainerId = createBlock('flexbox', id);
                    newTabIds.push(tabContainerId);
                }
            }
            // If we need fewer containers, truncate the array
            else if (currentTabIds.length > currentTabs.length) {
                // Delete the extra tab containers
                for (let i = currentTabs.length; i < currentTabIds.length; i++) {
                    if (currentTabIds[i]) {
                        deleteBlock(currentTabIds[i]);
                    }
                }
                newTabIds.splice(currentTabs.length);
            }

            // Update the parent block with the tab container IDs
            updateBlock(id, {
                tabIds: newTabIds
            });
        }
    }, [id, tabs.length, createBlock, updateBlock, getBlockById, deleteBlock]);

    // Handle tab change
    const handleTabChange = (activeKey) => {
        setCurrentActiveTab(activeKey);
        throttledUpdate(id, { activeTabId: activeKey });
    };

    // Add new tab
    const handleAddTab = () => {
        const newTabId = `tab${Date.now()}`;
        const newTabs = [...tabs, { id: newTabId, title: `Tab ${tabs.length + 1}` }];

        throttledUpdate(id, {
            tabs: newTabs,
            activeTabId: newTabId
        });
        setCurrentActiveTab(newTabId);
    };

    // Delete tab
    const handleDeleteTab = (tabId, e) => {
        e.stopPropagation();
        if (tabs.length <= 1) return; // Don't delete if it's the last tab

        const newTabs = tabs.filter(tab => tab.id !== tabId);
        let newActiveTabId = currentActiveTab;

        // If we're deleting the active tab, switch to the first remaining tab
        if (tabId === currentActiveTab) {
            newActiveTabId = newTabs[0]?.id || '';
        }

        throttledUpdate(id, {
            tabs: newTabs,
            activeTabId: newActiveTabId
        });
        setCurrentActiveTab(newActiveTabId);
    };

    // Start editing tab title
    const handleEditTab = (tabId, currentTitle, e) => {
        e.stopPropagation();
        setEditingTabId(tabId);
        setEditingTitle(currentTitle);
    };

    // Save tab title
    const handleSaveTabTitle = (tabId) => {
        const newTabs = tabs.map(tab =>
            tab.id === tabId ? { ...tab, title: editingTitle } : tab
        );

        throttledUpdate(id, { tabs: newTabs });
        setEditingTabId(null);
        setEditingTitle('');
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingTabId(null);
        setEditingTitle('');
    };

    // Handle key press in edit mode
    const handleKeyPress = (e, tabId) => {
        if (e.key === 'Enter') {
            handleSaveTabTitle(tabId);
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    // Create dropdown menu for tab options
    const getTabMenu = (tab) => (
        <Menu>
            <Menu.Item key="edit" icon={<EditOutlined />} onClick={(e) => handleEditTab(tab.id, tab.title, e)}>
                Edit Title
            </Menu.Item>
            <Menu.Item
                key="delete"
                icon={<DeleteOutlined />}
                onClick={(e) => handleDeleteTab(tab.id, e)}
                disabled={tabs.length <= 1}
                danger
            >
                Delete Tab
            </Menu.Item>
        </Menu>
    );

    // Generate tab items
    const tabItems = tabs.map((tab, index) => {
        const tabContainerId = tabIds[index];

        return {
            key: tab.id,
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {editingTabId === tab.id ? (
                        <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => handleSaveTabTitle(tab.id)}
                            onKeyDown={(e) => handleKeyPress(e, tab.id)}
                            autoFocus
                            style={{
                                border: '1px solid #d9d9d9',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                fontSize: '14px',
                                width: '100px'
                            }}
                        />
                    ) : (
                        <span>{tab.title}</span>
                    )}
                    {!editingTabId && (
                        <Dropdown
                            overlay={getTabMenu(tab)}
                            trigger={['click']}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Button
                                type="text"
                                size="small"
                                icon={<MoreOutlined />}
                                style={{ padding: '0 4px', height: '20px', lineHeight: '20px' }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </Dropdown>
                    )}
                </div>
            ),
            children: (
                <div
                    className={`tab-content ${isDragging ? 'during-drag' : ''}`}
                    style={{
                        minHeight: '200px',
                        padding: '10px'
                    }}
                >
                    {tabContainerId ? (
                        <DropZone parentId={tabContainerId} />
                    ) : (
                        <div className="loading">Loading tab content...</div>
                    )}
                </div>
            )
        };
    });

    const containerStyle = {
        backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor,
        border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        borderRadius: `${borderRadius}px`,
        padding: `${padding}px`,
        position: 'relative',
        width: '100%',
        minHeight: '300px'
    };

    return (
        <div
            className={`tabs-container ${isDragging ? 'during-drag' : ''}`}
            data-id={id}
            style={containerStyle}
            onClick={handleClick}
        >
            <Tabs
                activeKey={currentActiveTab}
                onChange={handleTabChange}
                type={tabStyle === 'card' ? 'card' : 'line'}
                tabPosition={tabPosition}
                items={tabItems}
                tabBarExtraContent={
                    <Button
                        type="dashed"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={handleAddTab}
                        style={{ marginLeft: '8px' }}
                    >
                        Add Tab
                    </Button>
                }
            />
        </div>
    );
};

export default withBaseElement(TabsBlockView);
