/**
 * Block initialization module
 * Import this file to ensure all blocks are registered
 * This supports dynamic/lazy loading of blocks in the future
 */

import blockManager from './block/blockManager';

// Import block definitions (this triggers their registration)
import '../blocks/text';
import '../blocks/image';
import '../blocks/example-container';
import '../blocks/column';
import '../blocks/tabs';

const registry = blockManager;
export default registry;
