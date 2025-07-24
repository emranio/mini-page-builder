/**
 * makeBlock - Factory function for creating block definitions
 * Centralizes block creation and registration logic
 */
import React, { useRef, useCallback, useEffect } from 'react';
import { useBuilder } from '../../../../contexts/BuilderReducer';
import styleManager from '../../../../utils/StyleManager';
import blockManager from './blockManager';

/**
 * Creates and registers a new block with the BlockManager
 * 
 * @param {object} options - Block configuration options
 * @param {string} options.type - Block type identifier
 * @param {string} options.name - Human-readable block name
 * @param {string} options.category - Block category
 * @param {React.Component} options.view - Block view component
 * @param {React.Component} options.settings - Block settings component
 * @param {function} options.style - Block style function
 * @param {React.Element} options.icon - Block icon element
 * @param {object} options.defaultProps - Default properties for this block
 * @returns {object} Registered block definition
 */
export function makeBlock({
    type,
    name,
    category,
    view: ViewComponent,
    settings: SettingsComponent,
    style: styleFunction,
    icon,
    defaultProps = {}
}) {
    // Create enhanced view component with base block functionality
    const EnhancedViewComponent = React.forwardRef((props, ref) => {
        const { updateBlock } = useBuilder();
        const throttleTimeoutRef = useRef(null);
        const { id } = props;

        const throttledUpdate = useCallback((elementId, newProps) => {
            if (throttleTimeoutRef.current) {
                clearTimeout(throttleTimeoutRef.current);
            }

            throttleTimeoutRef.current = setTimeout(() => {
                updateBlock(elementId, newProps);
                throttleTimeoutRef.current = null;
            }, 300); // 300ms throttle
        }, [updateBlock]);

        // Generate unique block ID
        const uniqueBlockId = styleManager.generateBlockId(id);

        // Update styles when props change
        useEffect(() => {
            if (id) {
                styleManager.updateBlockStyles(id, type, props);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props, id]);

        // Cleanup styles on unmount
        useEffect(() => {
            return () => {
                if (throttleTimeoutRef.current) {
                    clearTimeout(throttleTimeoutRef.current);
                }
                if (id) {
                    styleManager.removeBlockStyles(id);
                }
            };
        }, [id]);

        return (
            <ViewComponent
                ref={ref}
                {...props}
                throttledUpdate={throttledUpdate}
                uniqueBlockId={uniqueBlockId}
            />
        );
    });

    // Create block definition
    const blockDefinition = {
        type,
        name,
        category,
        icon,
        view: EnhancedViewComponent,
        settings: SettingsComponent,
        style: styleFunction,
        defaultProps
    };

    // Register with block manager
    return blockManager.registerBlock(type, blockDefinition);
}

export default makeBlock;
