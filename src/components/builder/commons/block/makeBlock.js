/**
 * makeBlock - Simplified factory function for creating and registering block definitions
 * Focuses on block registration without duplicating base functionality
 */
import blockManager from './blockManager';

/**
 * Creates and registers a new block with the BlockManager
 * 
 * @param {object} options - Block configuration options
 * @param {string} options.type - Block type identifier
 * @param {string} options.name - Human-readable block name
 * @param {string} options.category - Block category
 * @param {React.Component} options.view - Block view component (should already use withBaseBlock)
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
    // Create block definition
    const blockDefinition = {
        type,
        name,
        category,
        icon,
        view: ViewComponent, // View component should already use withBaseBlock
        settings: SettingsComponent,
        style: styleFunction,
        defaultProps
    };

    // Register with block manager
    return blockManager.registerBlock(type, blockDefinition);
}

export default makeBlock;
