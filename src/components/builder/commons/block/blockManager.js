/**
 * BlockManager - Centralized manager for all blocks in the page builder
 * Handles registration, retrieval, and style management for blocks
 */
import styleManager from './styleManager';

class blockManager {
    constructor() {
        this.blocks = new Map(); // blockName -> block definition
    }

    /**
     * Register a block with the BlockManager
     * @param {string} blockName - The block name identifier (text, image, etc.)
     * @param {object} blockDefinition - The block definition object
     */
    registerBlock(blockName, blockDefinition) {
        // Register the block
        this.blocks.set(blockName, blockDefinition);

        // Register the block's styles if they exist
        if (blockDefinition.style) {
            styleManager.registerBlockStyle(blockName, blockDefinition.style);
        }

        return blockDefinition;
    }

    /**
     * Get a block definition by name
     * @param {string} blockName - The block name to retrieve
     * @returns {object|undefined} The block definition or undefined if not found
     */
    getBlock(blockName) {
        return this.blocks.get(blockName);
    }

    /**
     * Get all registered blocks
     * @returns {Array} Array of all block definitions
     */
    getAllBlocks() {
        return Array.from(this.blocks.values());
    }

    /**
     * Get all registered block names
     * @returns {Array<string>} Array of block name identifiers
     */
    getBlockTypes() {
        return Array.from(this.blocks.keys());
    }

    /**
     * Get blocks by category
     * @param {string} category - The category to filter by
     * @returns {Array} Array of blocks in the specified category
     */
    getBlocksByCategory(category) {
        return this.getAllBlocks().filter(block => block.category === category);
    }

    /**
     * Get all drag types for drag and drop operations
     * Includes all registered block names plus the special CONTAINER_ITEM type
     * @returns {Array<string>} Array of drag type identifiers
     */
    getDragTypes() {
        const blockTypes = this.getBlockTypes();
        return [...blockTypes, 'CONTAINER_ITEM'];
    }

    /**
     * Get default props for a block name
     * @param {string} blockName - The block name identifier
     * @returns {object} Default props for the block name
     */
    getDefaultProps(blockName) {
        const blockDefinition = this.getBlock(blockName);
        return blockDefinition?.defaultProps || {};
    }

    /**
     * Get specific drag type constants for backwards compatibility
     * @returns {object} Object with drag type constants
     */
    getDragTypeConstants() {
        const blockTypes = this.getBlockTypes();
        const constants = {};

        // Add all registered block names
        blockTypes.forEach(name => {
            constants[name.toUpperCase().replace('-', '_')] = name;
        });

        // Add special container item type
        constants.CONTAINER_ITEM = 'CONTAINER_ITEM';

        return constants;
    }

    /**
     * Generate HTML string for a block using its view component
     * @param {object} block - Block object with id, type, and props
     * @param {function} getChildrenHTML - Function to get children HTML for container blocks
     * @returns {string} HTML string for the block
     */
    generateBlockHTML(block, getChildrenHTML) {
        const blockDefinition = this.getBlock(block.type);
        if (!blockDefinition || !blockDefinition.view) {
            return `<div class="unknown-block">Unknown Block Type: ${block.type}</div>`;
        }

        // Get block props with defaults applied
        const defaultProps = blockDefinition.defaultProps || {};
        const mergedProps = { ...defaultProps, ...block.props };

        // Generate unique ID for the block
        const uniqueId = styleManager.generateBlockId(block.id);

        // For blocks with view components, render to static HTML
        try {
            // Use the view component (not edit) for HTML generation
            const ViewComponent = blockDefinition.view;

            // Create a simplified props object for HTML generation
            const htmlProps = {
                ...mergedProps,
                id: block.id,
                uniqueBlockId: uniqueId,
                // For container blocks, we need to inject children HTML
                getChildrenHTML: getChildrenHTML
            };

            // Generate HTML based on the component type and props
            const blockHTML = this.renderComponentToHTML(ViewComponent, htmlProps, block.type);

            // Wrap block HTML in container with ID and class if content exists
            if (blockHTML) {
                const blockClass = `fildora-builder-${block.type}-block`;
                return `<div id="${uniqueId}" class="${blockClass}">${blockHTML}</div>`;
            }

            return '';
        } catch (error) {
            console.warn(`Error generating HTML for block ${block.type}:`, error);
            return `<div class="error-block">Error rendering ${block.type}</div>`;
        }
    }

    /**
     * Render a React component to static HTML
     * @param {React.Component} Component - The React component to render
     * @param {object} props - Props to pass to the component
     * @param {string} blockType - The block type for specialized handling
     * @returns {string} HTML string
     */
    renderComponentToHTML(Component, props, blockType) {
        // Since we simplified the view components to generate clean HTML,
        // we can try to use ReactDOMServer.renderToStaticMarkup in the future
        // For now, we'll use the existing logic but make it more flexible

        try {
            // For blocks that have simplified view components, try to render them
            // This is a simplified approach - in a real implementation, 
            // you might want to use ReactDOMServer.renderToStaticMarkup

            const content = this.getBlockHTMLContent(props, blockType);
            return content;
        } catch (error) {
            console.warn(`Error rendering component to HTML for ${blockType}:`, error);
            // Fallback to the hardcoded HTML generation
            return this.getFallbackHTML(props, blockType);
        }
    }

    /**
     * Get HTML content for a block type
     * @param {object} props - Block props
     * @param {string} blockType - Block type
     * @returns {string} HTML content
     */
    getBlockHTMLContent(props, blockType) {
        switch (blockType) {
            case 'text':
                return `<p class="text-block">${props.content || 'Simple text block'}</p>`;

            case 'image':
                return `<img src="${props.src || ''}" alt="${props.alt || 'Image'}" class="newsletter-image" />`;

            case 'example-container':
                const childrenHTML = props.getChildrenHTML ? props.getChildrenHTML(props.id) : '';
                return `<div class="example-container-content">${childrenHTML}</div>`;

            case 'column':
                return this.generateColumnHTML(props);

            case 'tabs':
                return this.generateTabsHTML(props);

            case 'debug-data':
                // Skip debug blocks in HTML output
                return '';

            default:
                // For custom blocks, try to extract basic content
                const content = props.content || props.text || props.title || `${blockType} block`;
                return `<div class="${blockType}-block">${content}</div>`;
        }
    }

    /**
     * Generate HTML for column blocks
     * @param {object} props - Column block props
     * @returns {string} Column HTML
     */
    generateColumnHTML(props) {
        const columnIds = props.columnIds || [];
        const columnWidths = props.columnWidths || [];
        const columns = props.columns || 2;

        let columnsHTML = '';
        for (let i = 0; i < columns; i++) {
            const width = columnWidths[i] || Math.floor(100 / columns);
            const columnId = columnIds[i];
            const columnContent = columnId && props.getChildrenHTML ? props.getChildrenHTML(columnId) : '';

            columnsHTML += `<div class="column-wrapper" style="flex: 0 0 ${width}%; max-width: ${width}%;">${columnContent}</div>`;
        }
        return `<div class="column-element-row">${columnsHTML}</div>`;
    }

    /**
     * Generate HTML for tabs blocks
     * @param {object} props - Tabs block props
     * @returns {string} Tabs HTML
     */
    generateTabsHTML(props) {
        const tabs = props.tabs || [];
        const activeTabId = props.activeTabId || (tabs[0] && tabs[0].id);
        const tabIds = props.tabIds || [];

        let tabHeadersHTML = '';
        let tabContentHTML = '';

        tabs.forEach((tab, index) => {
            const isActive = tab.id === activeTabId;
            const tabContainerId = tabIds[index];
            const tabContent = tabContainerId && props.getChildrenHTML ? props.getChildrenHTML(tabContainerId) : '';

            tabHeadersHTML += `<div class="tab-header ${isActive ? 'active' : ''}">${tab.title}</div>`;
            if (isActive) {
                tabContentHTML = `<div class="tab-content">${tabContent}</div>`;
            }
        });

        return `<div class="tabs-container">
            <div class="tab-headers">${tabHeadersHTML}</div>
            ${tabContentHTML}
        </div>`;
    }

    /**
     * Fallback HTML generation (legacy method)
     * @param {object} props - Block props
     * @param {string} blockType - Block type
     * @returns {string} HTML content
     */
    getFallbackHTML(props, blockType) {
        return this.getBlockHTMLContent(props, blockType);
    }
}

// Create singleton instance
const blockManagerInstance = new blockManager();

export default blockManagerInstance;
