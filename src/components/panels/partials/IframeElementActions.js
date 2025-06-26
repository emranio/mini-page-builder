import React from 'react';
import { Button, Dropdown } from 'antd';
import { DeleteOutlined, SettingOutlined, MoreOutlined } from '@ant-design/icons';
import { useBuilder } from '../../../contexts/BuilderContext';

/**
 * IframeElementActions - Element action buttons that work within iframe context
 * This component provides delete, settings, and other actions for elements in the iframe
 */
const IframeElementActions = ({ element, onSettingsClick }) => {
    const { deleteElement, setSelectedElementId } = useBuilder();

    const handleDelete = (e) => {
        e.stopPropagation();
        deleteElement(element.id);
    };

    const handleSettings = (e) => {
        e.stopPropagation();
        if (onSettingsClick) {
            onSettingsClick(element);
        }
        // Also send message to parent window to open settings
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'OPEN_ELEMENT_SETTINGS',
                elementId: element.id,
                elementType: element.type
            }, '*');
        }
    };

    const handleSelect = (e) => {
        e.stopPropagation();
        setSelectedElementId(element.id);
        // Notify parent window of selection
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'SELECT_ELEMENT',
                elementId: element.id
            }, '*');
        }
    };

    const menuItems = [
        {
            key: 'settings',
            label: 'Settings',
            icon: <SettingOutlined />,
            onClick: handleSettings
        },
        {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: handleDelete
        }
    ];

    return (
        <div className="iframe-element-actions" onClick={handleSelect}>
            <Button
                type="text"
                icon={<SettingOutlined />}
                size="small"
                className="action-button settings-button"
                onClick={handleSettings}
                title="Settings"
            />
            <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                className="action-button delete-button"
                onClick={handleDelete}
                title="Delete"
                danger
            />
            <Dropdown
                menu={{ items: menuItems }}
                trigger={['click']}
                placement="bottomRight"
            >
                <Button
                    type="text"
                    icon={<MoreOutlined />}
                    size="small"
                    className="action-button more-button"
                    title="More actions"
                />
            </Dropdown>
        </div>
    );
};

export default IframeElementActions;
