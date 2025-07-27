/**
 * BlockFactory - Advanced block creation system that eliminates redundancy
 * Automatically handles prop defaults, common handlers, and base functionality
 */
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { Form } from 'antd';
import { BaseSettings, withBaseBlock } from './BaseBlock';
import { useBuilder } from '../../../../data/BuilderReducer';
import blockManager from './blockManager';

/**
 * Creates an enhanced view component with automatic prop handling and common functionality
 */
export const createBlockView = (ViewComponent, blockName) => {
    const EnhancedView = memo(({ id, uniqueBlockId, ...props }) => {
        const { setSelectedBlockId } = useBuilder();

        // Get block definition to access default props
        const blockDef = blockManager.getBlock(blockName);

        // Merge props with defaults
        const mergedProps = useMemo(() => {
            const defaultProps = blockDef?.defaultProps || {};
            return {
                ...defaultProps,
                ...props,
                id,
                uniqueBlockId
            };
        }, [props, id, uniqueBlockId, blockDef]);

        // Common click handler for all blocks
        const handleClick = useCallback((e) => {
            e.stopPropagation();
            setSelectedBlockId(id);
        }, [id, setSelectedBlockId]);

        return (
            <div
                className={`fildora-builder-${blockName}-block`}
                id={uniqueBlockId}
                onClick={handleClick}
            >
                <ViewComponent
                    {...mergedProps}
                />
            </div>
        );
    });

    EnhancedView.displayName = `Enhanced${ViewComponent.displayName || ViewComponent.name || 'View'}`;
    return withBaseBlock(EnhancedView, blockName);
};

/**
 * Creates an enhanced settings component with automatic form handling
 */
export const createBlockSettings = (SettingsFormComponent, blockName, settingsConfig = {}, blockTitle = null) => {
    const {
        title = `${blockTitle || blockName} Settings`,
        width = 500,
        ...otherConfig
    } = settingsConfig;

    const EnhancedSettings = memo(({
        open,
        onClose,
        element,
        throttledUpdate,
        inline = false
    }) => {
        const [form] = Form.useForm();

        // Get block definition to access default props
        const blockDef = blockManager.getBlock(blockName);

        // Memoize initial values with defaults
        const initialValues = useMemo(() => {
            const defaultProps = blockDef?.defaultProps || {};
            const values = {};
            Object.keys(defaultProps).forEach(key => {
                values[key] = element.props?.[key] ?? defaultProps[key];
            });
            return values;
        }, [element.props, blockDef]);

        // Update form values when element props change
        useEffect(() => {
            form.setFieldsValue(initialValues);
        }, [form, initialValues]);

        // Common form change handler
        const handleValuesChange = useCallback((changedValues, allValues) => {
            throttledUpdate(element.id, allValues);
        }, [throttledUpdate, element.id]);

        return (
            <BaseSettings
                title={title}
                open={open}
                onCancel={onClose}
                form={form}
                initialValues={initialValues}
                onValuesChange={handleValuesChange}
                width={width}
                inline={inline}
                {...otherConfig}
            >
                <SettingsFormComponent
                    form={form}
                    element={element}
                    initialValues={initialValues}
                    throttledUpdate={throttledUpdate}
                />
            </BaseSettings>
        );
    });

    EnhancedSettings.displayName = `Enhanced${SettingsFormComponent.displayName || SettingsFormComponent.name || 'Settings'}`;
    return EnhancedSettings;
};

/**
 * Creates an enhanced style function with automatic prop handling
 */
export const createBlockStyle = (styleFunction, blockName) => {
    return (props, uniqueId) => {
        // Get block definition to access default props
        const blockDef = blockManager.getBlock(blockName);
        const defaultProps = blockDef?.defaultProps || {};

        // Merge props with defaults
        const mergedProps = { ...defaultProps, ...props };

        return styleFunction(mergedProps, uniqueId);
    };
};

/**
 * Enhanced makeBlock factory that automatically handles prop defaults and common functionality
 */
export const createBlock = ({
    name,
    title,
    category,
    blockType = 'field', // Default to 'field' if not specified
    icon,
    view: ViewComponent,
    edit: EditComponent, // Optional edit component for complex editing UI
    settings: SettingsFormComponent,
    style: styleFunction,
    defaultProps = {},
    settingsConfig = {}
}) => {
    // Create enhanced components
    const enhancedView = createBlockView(ViewComponent, name);
    const enhancedEdit = EditComponent ? createBlockView(EditComponent, name) : null;
    const enhancedSettings = createBlockSettings(SettingsFormComponent, name, settingsConfig, title);
    const enhancedStyle = createBlockStyle(styleFunction, name);

    // Create block definition
    const blockDefinition = {
        name,
        title,
        category,
        blockType, // Add blockType to definition
        icon,
        view: enhancedView,
        edit: enhancedEdit, // Component used in right panel for editing
        settings: enhancedSettings,
        style: enhancedStyle,
        defaultProps
    };

    // Register with block manager
    return blockManager.registerBlock(name, blockDefinition);
};

export default createBlock;
