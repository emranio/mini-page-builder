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
}

// Create singleton instance
const blockManagerInstance = new blockManager();

export default blockManagerInstance;
