/**
 * BlockManager - Centralized manager for all blocks in the page builder
 * Handles registration, retrieval, and style management for blocks
 */
import styleManager from './styleManager';

class blockManager {
    constructor() {
        this.blocks = new Map(); // blockType -> block definition
    }

    /**
     * Register a block with the BlockManager
     * @param {string} blockType - The block type identifier (text, image, etc.)
     * @param {object} blockDefinition - The block definition object
     */
    registerBlock(blockType, blockDefinition) {
        // Register the block
        this.blocks.set(blockType, blockDefinition);

        // Register the block's styles if they exist
        if (blockDefinition.style) {
            styleManager.registerBlockStyle(blockType, blockDefinition.style);
        }

        return blockDefinition;
    }

    /**
     * Get a block definition by type
     * @param {string} blockType - The block type to retrieve
     * @returns {object|undefined} The block definition or undefined if not found
     */
    getBlock(blockType) {
        return this.blocks.get(blockType);
    }

    /**
     * Get all registered blocks
     * @returns {Array} Array of all block definitions
     */
    getAllBlocks() {
        return Array.from(this.blocks.values());
    }

    /**
     * Get all registered block types
     * @returns {Array<string>} Array of block type identifiers
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
     * Includes all registered block types plus the special CONTAINER_ITEM type
     * @returns {Array<string>} Array of drag type identifiers
     */
    getDragTypes() {
        const blockTypes = this.getBlockTypes();
        return [...blockTypes, 'CONTAINER_ITEM'];
    }

    /**
     * Get default props for a block type
     * @param {string} blockType - The block type identifier
     * @returns {object} Default props for the block type
     */
    getDefaultProps(blockType) {
        const blockDefinition = this.getBlock(blockType);
        return blockDefinition?.defaultProps || {};
    }

    /**
     * Get specific drag type constants for backwards compatibility
     * @returns {object} Object with drag type constants
     */
    getDragTypeConstants() {
        const blockTypes = this.getBlockTypes();
        const constants = {};

        // Add all registered block types
        blockTypes.forEach(type => {
            constants[type.toUpperCase()] = type;
        });

        // Add special container item type
        constants.CONTAINER_ITEM = 'CONTAINER_ITEM';

        return constants;
    }
}

// Create singleton instance
const blockManagerInstance = new blockManager();

export default blockManagerInstance;
