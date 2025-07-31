import React, { useState, useEffect } from 'react';
import { Tabs } from '@mantine/core';
import { useBuilder } from '../../../../data/BuilderReducer';
import { DropZone } from '../../commons';

const TabsBlockView = ({
    id,
    tabs,
    activeTabId,
    tabIds,
    backgroundColor,
    borderStyle,
    borderWidth,
    borderColor,
    borderRadius,
    padding,
    tabStyle,
    tabPosition,
    throttledUpdate
}) => {
    const { updateBlock, createBlock, getBlockById, isDragging, deleteBlock } = useBuilder();
    const [currentActiveTab, setCurrentActiveTab] = useState(activeTabId);

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
                    const tabContainerId = createBlock('container', id);
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

    // Generate tab items for Mantine Tabs
    const tabItems = tabs.map((tab, index) => {
        const tabContainerId = tabIds[index];

        return {
            value: tab.id,
            children: tabContainerId ? (
                <DropZone parentId={tabContainerId} />
            ) : (
                <div className="loading">Loading tab content...</div>
            )
        };
    });

    return (
        <>
            <Tabs
                value={currentActiveTab}
                onChange={handleTabChange}
                variant={tabStyle === 'card' ? 'default' : 'outline'}
                orientation={tabPosition === 'left' || tabPosition === 'right' ? 'vertical' : 'horizontal'}
            >
                <Tabs.List>
                    {tabs.map(tab => (
                        <Tabs.Tab key={tab.id} value={tab.id}>
                            {tab.title}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                {tabs.map((tab, index) => {
                    const tabContainerId = tabIds[index];
                    return (
                        <Tabs.Panel key={tab.id} value={tab.id}>
                            {tabContainerId ? (
                                <DropZone parentId={tabContainerId} />
                            ) : (
                                <div className="loading">Loading tab content...</div>
                            )}
                        </Tabs.Panel>
                    );
                })}
            </Tabs>
        </>
    );
};

export default TabsBlockView;
