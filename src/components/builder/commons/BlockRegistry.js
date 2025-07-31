/**
 * Block initialization module
 * Import this file to ensure all blocks are registered
 * This supports dynamic/lazy loading of blocks in the future
 */

import blockManager from './block/blockManager';

// Import block definitions (this triggers their registration)
import '../blocks/text';
import '../blocks/image';
import '../blocks/container';
import '../blocks/column';
import '../blocks/tabs';
import '../blocks/debug-data';

const registry = blockManager;
export default registry;
