/**
 * Global utility functions for accessing Page Builder components
 * These functions provide easy access to components added to the right panel (canvas)
 */

import { useBuilder } from '../data/BuilderReducer';

/**
 * Custom hook to access all builder components with various filtering and formatting options
 * @returns {Object} Object with utility functions to get components
 */
export const useBuilderComponents = () => {
    const { getAllBuilderComponents, getContentComponents, getComponentsByBlockType } = useBuilder();

    return {
        /**
         * Get all components from the canvas
         * @param {Object} options - Configuration options
         * @param {string} options.format - 'flat' for 1D array, 'nested' for hierarchical structure (default: 'nested')
         * @param {boolean} options.includeLayout - Whether to include layout blocks like tabs, containers, columns (default: true)
         * @returns {Array} Array of components based on the specified format and filters
         * 
         * @example
         * // Get all components in nested format (including layout blocks)
         * const allComponents = getAllComponents();
         * 
         * // Get all components as a flat array (excluding layout blocks)
         * const contentOnly = getAllComponents({ format: 'flat', includeLayout: false });
         */
        getAllComponents: ({ format = 'nested', includeLayout = true } = {}) => {
            return getAllBuilderComponents(format, includeLayout);
        },

        /**
         * Get only content components (field and design blocks, excluding layout)
         * @param {Object} options - Configuration options
         * @param {string} options.format - 'flat' for 1D array, 'nested' for hierarchical structure (default: 'nested')
         * @returns {Array} Array of field and design components only
         * 
         * @example
         * // Get content components in nested format
         * const contentComponents = getContentComponents();
         * 
         * // Get content components as a flat array
         * const flatContent = getContentComponents({ format: 'flat' });
         */
        getContentComponents: ({ format = 'nested' } = {}) => {
            return getContentComponents(format);
        },

        /**
         * Get components by specific block type
         * @param {string} blockType - 'layout', 'field', or 'design'
         * @param {Object} options - Configuration options
         * @param {string} options.format - 'flat' for 1D array, 'nested' for hierarchical structure (default: 'nested')
         * @returns {Array} Array of components of the specified block type
         * 
         * @example
         * // Get only layout components
         * const layoutComponents = getComponentsByType('layout');
         * 
         * // Get only field components as flat array
         * const fieldComponents = getComponentsByType('field', { format: 'flat' });
         */
        getComponentsByType: (blockType, { format = 'nested' } = {}) => {
            return getComponentsByBlockType(blockType, format);
        },

        /**
         * Get layout components only (containers, tabs, columns)
         * @param {Object} options - Configuration options
         * @param {string} options.format - 'flat' for 1D array, 'nested' for hierarchical structure (default: 'nested')
         * @returns {Array} Array of layout components
         */
        getLayoutComponents: ({ format = 'nested' } = {}) => {
            return getComponentsByBlockType('layout', format);
        },

        /**
         * Get field components only (text inputs, form fields)
         * @param {Object} options - Configuration options
         * @param {string} options.format - 'flat' for 1D array, 'nested' for hierarchical structure (default: 'nested')
         * @returns {Array} Array of field components
         */
        getFieldComponents: ({ format = 'nested' } = {}) => {
            return getComponentsByBlockType('field', format);
        },

        /**
         * Get design components only (images, visual elements)
         * @param {Object} options - Configuration options
         * @param {string} options.format - 'flat' for 1D array, 'nested' for hierarchical structure (default: 'nested')
         * @returns {Array} Array of design components
         */
        getDesignComponents: ({ format = 'nested' } = {}) => {
            return getComponentsByBlockType('design', format);
        }
    };
};

/**
 * Direct functions for use outside of React components
 * Note: These require the BuilderReducer context to be available
 */

/**
 * Get all components from the canvas (for use outside React components)
 * @param {Object} builderState - The builder state object from useBuilder hook
 * @param {string} format - 'flat' for 1D array, 'nested' for hierarchical structure
 * @param {boolean} includeLayout - Whether to include layout blocks
 * @returns {Array} Array of components
 */
export const getAllBuilderComponents = (builderState, format = 'nested', includeLayout = true) => {
    return builderState.getAllBuilderComponents(format, includeLayout);
};

/**
 * Get only content components (for use outside React components)
 * @param {Object} builderState - The builder state object from useBuilder hook
 * @param {string} format - 'flat' for 1D array, 'nested' for hierarchical structure
 * @returns {Array} Array of content components
 */
export const getContentComponents = (builderState, format = 'nested') => {
    return builderState.getContentComponents(format);
};

/**
 * Get components by type (for use outside React components)
 * @param {Object} builderState - The builder state object from useBuilder hook
 * @param {string} blockType - 'layout', 'field', or 'design'
 * @param {string} format - 'flat' for 1D array, 'nested' for hierarchical structure
 * @returns {Array} Array of components of the specified type
 */
export const getComponentsByType = (builderState, blockType, format = 'nested') => {
    return builderState.getComponentsByBlockType(blockType, format);
};
