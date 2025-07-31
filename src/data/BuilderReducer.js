import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import blockManager from '../components/builder/commons/block/blockManager';
import styleManager from '../components/builder/commons/block/styleManager';

// Import BlockRegistry to ensure all blocks are registered
import '../components/builder/commons/BlockRegistry';

const BuilderReducerContext = createContext();

export const useBuilder = () => useContext(BuilderReducerContext);

// Action types
const ACTION_TYPES = {
    SET_DRAGGING_STATE: 'SET_DRAGGING_STATE',
    SET_DRAGGED_BLOCK_ID: 'SET_DRAGGED_BLOCK_ID',
    SET_SELECTED_BLOCK_ID: 'SET_SELECTED_BLOCK_ID',
    CREATE_BLOCK: 'CREATE_BLOCK',
    MOVE_BLOCK: 'MOVE_BLOCK',
    UPDATE_BLOCK: 'UPDATE_BLOCK',
    DELETE_BLOCK: 'DELETE_BLOCK'
};

// Initial state
const initialState = {
    blocks: [],
    rootBlocksOrder: [],
    isDragging: false,
    draggedBlockId: null,
    selectedBlockId: null
};

// Helper functions
const findAllChildrenIds = (blocks, blockId) => {
    const idsToDelete = new Set([blockId]);
    const findChildren = (id) => {
        const block = blocks.find(bl => bl.id === id);
        if (block && block.children) {
            block.children.forEach(childId => {
                idsToDelete.add(childId);
                findChildren(childId);
            });
        }
    };
    findChildren(blockId);
    return idsToDelete;
};

// Selector functions - moved outside component for better performance
const createSelectors = (state) => {
    // Create a blocks lookup map for O(1) access
    const blocksMap = new Map(state.blocks.map(block => [block.id, block]));

    return {
        // Get all blocks at the root level or children of a specific parent
        getBlocks: (parentId = null) => {
            if (parentId === null) {
                // For root level, return blocks in the order defined by rootBlocksOrder
                return state.rootBlocksOrder
                    .map(blockId => blocksMap.get(blockId))
                    .filter(Boolean);
            }

            // For children, get them in the order specified by parent's children array
            const parent = blocksMap.get(parentId);
            if (!parent || !parent.children) {
                return state.blocks.filter(block => block.parentId === parentId);
            }

            // Return children in the correct order
            return parent.children
                .map(childId => blocksMap.get(childId))
                .filter(Boolean);
        },

        // Get a specific block by ID
        getBlockById: (id) => {
            return blocksMap.get(id);
        },

        // Get all children of a block
        getChildrenOfBlock: (blockId) => {
            const block = blocksMap.get(blockId);
            if (!block || !block.children || block.children.length === 0) {
                return [];
            }

            return block.children
                .map(childId => blocksMap.get(childId))
                .filter(Boolean);
        },

        // Check if container has only container children
        hasOnlyContainerChildren: (blockId) => {
            const block = blocksMap.get(blockId);
            if (!block || !block.children || block.children.length === 0) return false;

            const children = block.children
                .map(childId => blocksMap.get(childId))
                .filter(Boolean);

            return children.every(child => child.type === 'container');
        },

        // Check if container has mixed children (blocks and containers)
        hasMixedChildren: (blockId) => {
            const block = blocksMap.get(blockId);
            if (!block || !block.children || block.children.length <= 1) return false;

            const children = block.children
                .map(childId => blocksMap.get(childId))
                .filter(Boolean);

            const hasContainers = children.some(child => child.type === 'container');
            const hasBlocks = children.some(child => child.type !== 'container');
            return hasContainers && hasBlocks;
        },

        /**
         * Get all components from the right panel (canvas) with filtering and formatting options
         * @param {string} format - 'flat' for 1D array, 'nested' for hierarchical structure
         * @param {boolean} includeLayout - Whether to include layout blocks (tabs, containers, columns)
         * @returns {Array} Array of components based on the specified format and filters
         */
        getEditorComponents: (format = 'nested', includeLayout = true) => {
            const isLayoutBlock = (blockType) => {
                const blockDefinition = blockManager.getBlock(blockType);
                return blockDefinition?.blockType === 'layout';
            };

            if (format === 'flat') {
                // Return all blocks as a flat array
                let flatBlocks = state.blocks.map(block => ({
                    id: block.id,
                    type: block.type,
                    blockType: blockManager.getBlock(block.type)?.blockType || 'field',
                    name: blockManager.getBlock(block.type)?.title || block.type,
                    parentId: block.parentId,
                    props: block.props,
                    children: block.children || null
                }));

                // Filter out layout blocks if requested
                if (!includeLayout) {
                    flatBlocks = flatBlocks.filter(block => !isLayoutBlock(block.type));
                }

                return flatBlocks;
            } else {
                // Return blocks in nested hierarchy format
                const buildHierarchy = (parentId) => {
                    const children = state.blocks
                        .filter(block => block.parentId === parentId)
                        .map(block => {
                            const blockDefinition = blockManager.getBlock(block.type);
                            const isLayout = isLayoutBlock(block.type);

                            // Skip layout blocks if not including them
                            if (!includeLayout && isLayout) {
                                // But still traverse their children
                                return buildHierarchy(block.id);
                            }

                            const blockData = {
                                id: block.id,
                                type: block.type,
                                blockType: blockDefinition?.blockType || 'field',
                                name: blockDefinition?.title || block.type,
                                parentId: block.parentId,
                                props: block.props
                            };

                            // Add children if they exist
                            const blockChildren = buildHierarchy(block.id);
                            if (blockChildren.length > 0) {
                                blockData.children = blockChildren;
                            }

                            return blockData;
                        })
                        .flat() // Flatten in case we skipped layout blocks
                        .filter(Boolean);

                    return children;
                };

                return buildHierarchy(null); // Start from root blocks
            }
        },

        /**
         * Get only field and design components (excluding layout)
         * @param {string} format - 'flat' for 1D array, 'nested' for hierarchical structure
         * @returns {Array} Array of field and design components
         */
        getContentComponents: (format = 'nested') => {
            return createSelectors(state).getEditorComponents(format, false);
        },

        /**
         * Get components by specific block type
         * @param {string} blockType - 'layout', 'field', or 'design'
         * @param {string} format - 'flat' for 1D array, 'nested' for hierarchical structure
         * @returns {Array} Array of components of the specified block type
         */
        getComponentsByBlockType: (blockType, format = 'nested') => {
            const allComponents = createSelectors(state).getEditorComponents(format, true);

            const filterByType = (components) => {
                return components
                    .filter(component => component.blockType === blockType)
                    .map(component => {
                        if (component.children && format === 'nested') {
                            return {
                                ...component,
                                children: filterByType(component.children)
                            };
                        }
                        return component;
                    });
            };

            return filterByType(allComponents);
        },

        /**
         * Get all generated CSS for blocks in the right panel
         * @returns {string} Combined CSS string for all blocks
         */
        getAllBlocksCSS: () => {
            // Get all blocks in flat format to generate CSS
            const allBlocks = state.blocks.map(block => ({
                id: block.id,
                type: block.type,
                props: block.props
            }));

            return styleManager.generateCSSForBlocks(allBlocks);
        },

        /**
         * Get currently applied CSS (from DOM style elements)
         * @returns {string} Combined CSS string from DOM
         */
        getAppliedCSS: () => {
            return styleManager.getGeneratedCSS();
        },

        /**
         * Generate static HTML for all blocks in the right panel
         * @param {Object} options - Configuration options for HTML generation
         * @param {boolean} options.includeCSS - Whether to include CSS styles in the HTML (default: true)
         * @param {boolean} options.inlineStyles - Whether to use inline styles instead of CSS classes (default: false)
         * @param {string} options.containerClass - CSS class name for the root container (default: 'page-builder-content')
         * @returns {string} Complete HTML string for all blocks
         */
        getBlocksHTML: (options = {}) => {
            const {
                includeCSS = true,
                inlineStyles = false,
                containerClass = 'page-builder-content'
            } = options;

            // Get all blocks in nested format to preserve hierarchy
            const allBlocks = state.blocks;
            const rootBlocksOrder = state.rootBlocksOrder;

            // Helper function to generate HTML for a single block
            const generateBlockHTML = (block) => {
                // Use blockManager to generate HTML from view component
                return blockManager.generateBlockHTML(block, getChildrenHTML);
            };

            // Helper function to get children HTML for a parent block
            const getChildrenHTML = (parentId) => {
                const children = allBlocks.filter(block => block.parentId === parentId);
                // Sort children by their order if they have a children array in parent
                const parent = allBlocks.find(block => block.id === parentId);
                if (parent && parent.children) {
                    const orderedChildren = parent.children
                        .map(childId => children.find(child => child.id === childId))
                        .filter(Boolean);
                    return orderedChildren.map(generateBlockHTML).join('\n');
                }
                return children.map(generateBlockHTML).join('\n');
            };

            // Generate HTML for root blocks in order
            const rootBlocks = rootBlocksOrder
                .map(blockId => allBlocks.find(block => block.id === blockId))
                .filter(Boolean);

            const contentHTML = rootBlocks.map(generateBlockHTML).join('\n');

            // Generate CSS if needed
            let cssHTML = '';
            if (includeCSS && !inlineStyles) {
                const allBlocksCSS = styleManager.generateCSSForBlocks(allBlocks.map(block => ({
                    id: block.id,
                    type: block.type,
                    props: block.props
                })));

                if (allBlocksCSS) {
                    cssHTML = `<style>\n${allBlocksCSS}\n</style>\n`;
                }
            }

            // Combine everything into complete HTML
            const completeHTML = `${cssHTML}<div class="${containerClass}">\n${contentHTML}\n</div>`;

            return completeHTML;
        }
    };
};

// Reducer function
const builderReducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.SET_DRAGGING_STATE:
            return {
                ...state,
                isDragging: action.payload
            };

        case ACTION_TYPES.SET_DRAGGED_BLOCK_ID:
            return {
                ...state,
                draggedBlockId: action.payload
            };

        case ACTION_TYPES.SET_SELECTED_BLOCK_ID:
            return {
                ...state,
                selectedBlockId: action.payload
            };

        case ACTION_TYPES.CREATE_BLOCK: {
            const { type, parentId, props, index, blockId } = action.payload;

            // Get default props from centralized block manager
            const defaultProps = blockManager.getDefaultProps(type);

            const newBlock = {
                id: blockId,
                type,
                parentId,
                props: { ...defaultProps, ...props },
                children: type === 'container' ? [] : null
            };

            // Add the new block to blocks array
            const newBlocks = [...state.blocks, newBlock];

            // Update parent's children array if it has a parent
            if (parentId) {
                const parentIndex = newBlocks.findIndex(bl => bl.id === parentId);
                if (parentIndex !== -1) {
                    const parentChildren = [...(newBlocks[parentIndex].children || [])];

                    // Insert at specific index if provided, otherwise append to end
                    if (index !== null && index >= 0 && index <= parentChildren.length) {
                        parentChildren.splice(index, 0, newBlock.id);
                    } else {
                        parentChildren.push(newBlock.id);
                    }

                    // Update the parent with new children array
                    newBlocks[parentIndex] = {
                        ...newBlocks[parentIndex],
                        children: parentChildren
                    };
                }
            }

            // Update root blocks order if it's a root block
            let newRootBlocksOrder = [...state.rootBlocksOrder];
            if (parentId === null) {
                if (index !== null && index >= 0 && index <= newRootBlocksOrder.length) {
                    newRootBlocksOrder.splice(index, 0, newBlock.id);
                } else {
                    newRootBlocksOrder.push(newBlock.id);
                }
            }

            return {
                ...state,
                blocks: newBlocks,
                rootBlocksOrder: newRootBlocksOrder
            };
        }

        case ACTION_TYPES.MOVE_BLOCK: {
            const { blockId, targetParentId, index } = action.payload;

            // Find the block to move
            const blockToMove = state.blocks.find(bl => bl.id === blockId);
            if (!blockToMove) {
                return state;
            }

            const oldParentId = blockToMove.parentId;

            // Remove from old parent's children (if not root level)
            let updatedBlocks = state.blocks.map(bl => {
                if (bl.id === oldParentId) {
                    return {
                        ...bl,
                        children: bl.children.filter(childId => childId !== blockId)
                    };
                }
                return bl;
            });

            // Update the block's parent reference
            const updatedBlockToMove = {
                ...blockToMove,
                parentId: targetParentId
            };

            // Add to new parent's children at the specified index (if not root level)
            updatedBlocks = updatedBlocks
                .map(bl => {
                    if (bl.id === targetParentId) {
                        const newChildren = [...(bl.children || [])];
                        newChildren.splice(index, 0, blockId);
                        return {
                            ...bl,
                            children: newChildren
                        };
                    }
                    return bl;
                })
                .map(bl => bl.id === blockId ? updatedBlockToMove : bl);

            // Handle root block ordering changes
            let newRootBlocksOrder = [...state.rootBlocksOrder];

            // Remove from old position
            const oldIndex = newRootBlocksOrder.indexOf(blockId);
            if (oldIndex !== -1) {
                newRootBlocksOrder.splice(oldIndex, 1);
            }

            // Add to new position if moving to root level
            if (targetParentId === null) {
                newRootBlocksOrder.splice(index, 0, blockId);
            }

            return {
                ...state,
                blocks: updatedBlocks,
                rootBlocksOrder: newRootBlocksOrder
            };
        }

        case ACTION_TYPES.UPDATE_BLOCK: {
            const { blockId, newProps } = action.payload;

            const blockToUpdate = state.blocks.find(bl => bl.id === blockId);
            if (!blockToUpdate) {
                return state;
            }

            const updatedBlocks = state.blocks.map(block =>
                block.id === blockId
                    ? { ...block, props: { ...block.props, ...newProps } }
                    : block
            );

            return {
                ...state,
                blocks: updatedBlocks
            };
        }

        case ACTION_TYPES.DELETE_BLOCK: {
            const { blockId } = action.payload;

            // Find block to delete
            const blockToDelete = state.blocks.find(bl => bl.id === blockId);
            if (!blockToDelete) {
                return state;
            }

            const parentId = blockToDelete.parentId;

            // Get all IDs to delete (including children)
            const idsToDelete = findAllChildrenIds(state.blocks, blockId);

            // Update parent's children list
            let updatedBlocks = state.blocks.map(bl => {
                if (bl.id === parentId) {
                    return {
                        ...bl,
                        children: bl.children.filter(childId => childId !== blockId)
                    };
                }
                return bl;
            });

            // Filter out all deleted blocks
            updatedBlocks = updatedBlocks.filter(bl => !idsToDelete.has(bl.id));

            // Remove from root blocks order if it's a root block
            const newRootBlocksOrder = state.rootBlocksOrder.filter(id => id !== blockId);

            return {
                ...state,
                blocks: updatedBlocks,
                rootBlocksOrder: newRootBlocksOrder
            };
        }

        default:
            return state;
    }
};

export const BuilderProvider = ({ children }) => {
    const [state, dispatch] = useReducer(builderReducer, initialState);

    // Add/remove body class when dragging state changes
    useEffect(() => {
        if (state.isDragging) {
            document.body.classList.add('dragging');
        } else {
            document.body.classList.remove('dragging');
            // Small delay to ensure UI updates after drag ends
            setTimeout(() => {
                dispatch({ type: ACTION_TYPES.SET_DRAGGED_BLOCK_ID, payload: null });
            }, 50);
        }
    }, [state.isDragging]);

    // Memoized selectors
    const selectors = useMemo(() => createSelectors(state), [state]);

    // Action creators - wrapped in useCallback for stable references
    const actions = useMemo(() => ({
        setIsDragging: (isDragging) => {
            dispatch({ type: ACTION_TYPES.SET_DRAGGING_STATE, payload: isDragging });
        },

        setDraggedBlockId: (blockId) => {
            dispatch({ type: ACTION_TYPES.SET_DRAGGED_BLOCK_ID, payload: blockId });
        },

        setSelectedBlockId: (blockId) => {
            dispatch({ type: ACTION_TYPES.SET_SELECTED_BLOCK_ID, payload: blockId });
        },

        createBlock: (type, parentId = null, props = {}, index = null) => {
            const blockId = uuidv4();

            dispatch({
                type: ACTION_TYPES.CREATE_BLOCK,
                payload: { type, parentId, props, index, blockId }
            });

            return blockId;
        },

        moveBlock: (blockId, targetParentId, index) => {
            dispatch({
                type: ACTION_TYPES.MOVE_BLOCK,
                payload: { blockId, targetParentId, index }
            });
        },

        updateBlock: (blockId, newProps) => {
            dispatch({
                type: ACTION_TYPES.UPDATE_BLOCK,
                payload: { blockId, newProps }
            });
        },

        deleteBlock: (blockId) => {
            dispatch({
                type: ACTION_TYPES.DELETE_BLOCK,
                payload: { blockId }
            });
        },

        // Resize containers - this function is kept for backward compatibility but does nothing now
        resizeContainer: (blockId, newWidthPercent) => {
            // All containers are now 100% width, so this function does nothing
        }
    }), []);

    // Memoized context value - prevents unnecessary re-renders
    const value = useMemo(() => ({
        // State
        blocks: state.blocks,
        isDragging: state.isDragging,
        draggedBlockId: state.draggedBlockId,
        selectedBlockId: state.selectedBlockId,

        // Actions
        ...actions,

        // Selectors
        ...selectors
    }), [state, actions, selectors]);

    return (
        <BuilderReducerContext.Provider value={value}>
            {children}
        </BuilderReducerContext.Provider>
    );
};
