/**
 * Initialize the style system for all blocks
 * This ensures all block styles are registered when the app loads
 */
import './blocks/text';
import './blocks/image';
import './blocks/flexbox';
import './blocks/column';
import './blocks/tabs';

// The importing of the block index files will automatically register their styles
// due to the styleManager.registerBlockStyle() calls in each index.js file

export default {};
