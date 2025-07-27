import React from 'react';

/**
 * TabsBlockView - Simplified view for HTML generation
 * This component generates clean HTML without editing functionality
 */
const TabsBlockView = ({
    tabs,
    activeTabId,
    tabIds,
    getChildrenHTML,
    id
}) => {
    const activeTab = activeTabId || (tabs?.[0]?.id);

    const renderTabHeaders = () => {
        return tabs?.map((tab) => (
            <div
                key={tab.id}
                className={`tab-header ${tab.id === activeTab ? 'active' : ''}`}
            >
                {tab.title}
            </div>
        ));
    };

    const renderTabContent = () => {
        const activeTabIndex = tabs?.findIndex(tab => tab.id === activeTab);
        if (activeTabIndex !== -1 && tabIds?.[activeTabIndex]) {
            const tabContainerId = tabIds[activeTabIndex];
            const tabContent = getChildrenHTML ? getChildrenHTML(tabContainerId) : '';

            return (
                <div
                    className="tab-content"
                    dangerouslySetInnerHTML={{ __html: tabContent }}
                />
            );
        }
        return <div className="tab-content"></div>;
    };

    return (
        <div className="tabs-container">
            <div className="tab-headers">
                {renderTabHeaders()}
            </div>
            {renderTabContent()}
        </div>
    );
};

export default TabsBlockView;