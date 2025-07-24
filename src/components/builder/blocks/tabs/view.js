import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { useBuilder } from '../../../../contexts/BuilderReducer';
import { DropZone } from '../../commons';
import { withBaseBlock } from '../../commons/base';

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
    throttledUpdate,
    uniqueBlockId
}) => {
    const { updateBlock, createBlock, getBlockById, isDragging, setSelectedBlockId, deleteBlock } = useBuilder();
    const [currentActiveTab, setCurrentActiveTab] = useState(activeTabId);

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
            // If we need fewer containers, clean up extra ones
            else if (currentTabIds.length > currentTabs.length) {
                // Delete the extra tab containers safely
                for (let i = currentTabs.length; i < currentTabIds.length; i++) {
                    const containerIdToDelete = currentTabIds[i];
                    if (containerIdToDelete) {
                        // Check if the container still exists before trying to delete it
                        const containerExists = getBlockById(containerIdToDelete);
                        if (containerExists) {
                            try {
                                deleteBlock(containerIdToDelete);
                            } catch (error) {
                                console.warn('Failed to delete tab container:', containerIdToDelete, error);
                            }
                        }
                    }
                }
                newTabIds.splice(currentTabs.length);
            }

            // Update the parent block with the tab container IDs
            updateBlock(id, {
                tabIds: newTabIds
            });
        }
    }, [id, tabs, tabIds, createBlock, updateBlock, getBlockById, deleteBlock]);

    // Handle tab change
    const handleTabChange = (activeKey) => {
        setCurrentActiveTab(activeKey);
        throttledUpdate(id, { activeTabId: activeKey });
    };

    // Generate tab items
    const tabItems = tabs.map((tab, index) => {
        const tabContainerId = tabIds[index];

        return {
            key: tab.id,
            label: tab.title,
            children: tabContainerId ? (
                <DropZone parentId={tabContainerId} />
            ) : (
                <div className="loading">Loading tab content...</div>
            )
        };
    });

    return (
        <div
            id={uniqueBlockId}
            className={`tabs-container ${isDragging ? 'during-drag' : ''}`}
            data-id={id}
            onClick={handleClick}
        >
            <Tabs
                activeKey={currentActiveTab}
                onChange={handleTabChange}
                type={tabStyle === 'card' ? 'card' : 'line'}
                tabPosition={tabPosition}
                items={tabItems}
            />
        </div>
    );
};

export default withBaseBlock(TabsBlockView, 'tabs');
