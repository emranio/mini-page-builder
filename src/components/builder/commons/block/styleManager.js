/**
 * StyleManager - Utility for managing dynamic CSS injection
 * Handles creation and cleanup of style tags for blocks
 */
class StyleManager {
    constructor() {
        this.styleElements = new Map(); // blockId -> style element
        this.blockStyles = new Map(); // blockType -> style function
    }

    /**
     * Register a style function for a block type
     * @param {string} blockType - The block type (text, image, etc.)
     * @param {function} styleFunction - Function that takes props and returns CSS
     */
    registerBlockStyle(blockType, styleFunction) {
        this.blockStyles.set(blockType, styleFunction);
    }

    /**
     * Generate unique block ID with fieldora-builder prefix
     * @param {string} blockId - The original block ID
     * @returns {string} Prefixed ID
     */
    generateBlockId(blockId) {
        return `fieldora-builder-block-${blockId}`;
    }

    /**
     * Update or create styles for a block
     * @param {string} blockId - The block ID
     * @param {string} blockType - The block type
     * @param {object} props - The block properties
     */
    updateBlockStyles(blockId, blockType, props = {}) {
        const styleFunction = this.blockStyles.get(blockType);
        if (!styleFunction) {
            console.warn(`No style function registered for block type: ${blockType}`);
            return;
        }

        const uniqueId = this.generateBlockId(blockId);
        const css = styleFunction(props, uniqueId);

        if (!css) return;

        // Remove existing style element for this block
        this.removeBlockStyles(blockId);

        // Create new style element
        const styleElement = document.createElement('style');
        styleElement.setAttribute('data-block-id', blockId);
        styleElement.setAttribute('data-block-type', blockType);
        styleElement.textContent = css;

        // Add to head
        document.head.appendChild(styleElement);

        // Store reference for cleanup
        this.styleElements.set(blockId, styleElement);
    }

    /**
     * Remove styles for a specific block
     * @param {string} blockId - The block ID
     */
    removeBlockStyles(blockId) {
        const styleElement = this.styleElements.get(blockId);
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        }
        this.styleElements.delete(blockId);
    }

    /**
     * Clean up all styles (useful for unmounting)
     */
    cleanup() {
        this.styleElements.forEach((styleElement) => {
            if (styleElement && styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement);
            }
        });
        this.styleElements.clear();
    }

    /**
     * Get all registered block types
     * @returns {Array<string>} Array of block types
     */
    getRegisteredBlockTypes() {
        return Array.from(this.blockStyles.keys());
    }
}

// Create singleton instance
const styleManager = new StyleManager();

export default styleManager;
