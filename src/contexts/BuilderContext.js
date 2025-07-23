import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TextBlock from '../components/builder/blocks/text';
import ImageBlock from '../components/builder/blocks/image';
import FlexboxBlock from '../components/builder/blocks/flexbox';
import ColumnBlock from '../components/builder/blocks/column';
import TabsBlock from '../components/builder/blocks/tabs';

const BuilderContext = createContext();

export const useBuilder = () => useContext(BuilderContext);

// Block registry for getting default props
const blockRegistry = {
    text: TextBlock,
    image: ImageBlock,
    flexbox: FlexboxBlock,
    column: ColumnBlock,
    tabs: TabsBlock
};

export const BuilderProvider = ({ children }) => {
    const [blocks, setBlocks] = useState([]);
    const [rootBlocksOrder, setRootBlocksOrder] = useState([]); // Track order of root blocks
    const [isDragging, setIsDragging] = useState(false);
    const [draggedBlockId, setDraggedBlockId] = useState(null);
    const [selectedBlockId, setSelectedBlockId] = useState(null);

    // Add/remove body class when dragging state changes
    useEffect(() => {
        if (isDragging) {
            document.body.classList.add('dragging');
        } else {
            document.body.classList.remove('dragging');
            // Small delay to ensure UI updates after drag ends
            setTimeout(() => {
                setDraggedBlockId(null);
            }, 50);
        }
    }, [isDragging]);

    // Create a new block
    const createBlock = useCallback((type, parentId = null, props = {}, index = null) => {
        // Get default props from block registry
        const blockConfig = blockRegistry[type];
        const defaultProps = blockConfig?.defaultProps || {};

        const newBlock = {
            id: uuidv4(),
            type,
            parentId,
            props: { ...defaultProps, ...props },
            children: type === 'flexbox' ? [] : null
        };

        setBlocks(prevBlocks => {
            // Create a new array with the new block
            const newBlocks = [...prevBlocks, newBlock];

            // If it has a parent, update the parent's children array
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

                    // Create a new parent object with updated children array
                    newBlocks[parentIndex] = {
                        ...newBlocks[parentIndex],
                        children: parentChildren
                    };
                }
            }

            return newBlocks;
        });

        // Handle root block ordering
        if (parentId === null) {
            setRootBlocksOrder(prevOrder => {
                const newOrder = [...prevOrder];
                if (index !== null && index >= 0 && index <= newOrder.length) {
                    newOrder.splice(index, 0, newBlock.id);
                } else {
                    newOrder.push(newBlock.id);
                }
                return newOrder;
            });
        }

        return newBlock.id;
    }, []);

    // Move a block to a new parent or position
    const moveBlock = useCallback((blockId, targetParentId, index) => {
        setBlocks(prevBlocks => {
            // Find the block to move and its current parent
            const blockToMove = prevBlocks.find(bl => bl.id === blockId);
            if (!blockToMove) {
                return prevBlocks;
            }
            const oldParentId = blockToMove.parentId;

            // Remove from old parent's children (if not root level)
            const updatedBlocks = prevBlocks.map(bl => {
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
            const result = updatedBlocks
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

            return result;
        });

        // Handle root block ordering changes
        setRootBlocksOrder(prevOrder => {
            const newOrder = [...prevOrder];

            // Remove from old position
            const oldIndex = newOrder.indexOf(blockId);
            if (oldIndex !== -1) {
                newOrder.splice(oldIndex, 1);
            }

            // Add to new position if moving to root level
            if (targetParentId === null) {
                newOrder.splice(index, 0, blockId);
            }

            return newOrder;
        });
    }, []);

    // Update block properties
    const updateBlock = useCallback((blockId, newProps) => {
        console.log(`Updating block ${blockId} with props:`, newProps);

        setBlocks(prevBlocks => {
            const blockToUpdate = prevBlocks.find(bl => bl.id === blockId);
            if (!blockToUpdate) {
                console.warn(`Block ${blockId} not found, cannot update`);
                return prevBlocks;
            }

            console.log(`Before update - block props:`, blockToUpdate.props);

            const updatedBlocks = prevBlocks.map(block =>
                block.id === blockId
                    ? { ...block, props: { ...block.props, ...newProps } }
                    : block
            );

            const updatedBlock = updatedBlocks.find(bl => bl.id === blockId);
            console.log(`After update - block props:`, updatedBlock.props);

            return updatedBlocks;
        });
    }, []);

    // Delete a block and its children recursively
    const deleteBlock = useCallback((blockId) => {
        setBlocks(prevBlocks => {
            // Find block to delete and its parent
            const blockToDelete = prevBlocks.find(bl => bl.id === blockId);

            // If block doesn't exist, return unchanged blocks
            if (!blockToDelete) {
                console.warn(`Block with id ${blockId} not found for deletion`);
                return prevBlocks;
            }

            const parentId = blockToDelete.parentId;

            // Get all IDs to delete (including children)
            const idsToDelete = new Set([blockId]);
            const findAllChildren = (id) => {
                const block = prevBlocks.find(bl => bl.id === id);
                if (block && block.children) {
                    block.children.forEach(childId => {
                        idsToDelete.add(childId);
                        findAllChildren(childId);
                    });
                }
            };
            findAllChildren(blockId);

            // Update parent's children list
            let updatedBlocks = prevBlocks.map(bl => {
                if (bl.id === parentId) {
                    return {
                        ...bl,
                        children: bl.children.filter(childId => childId !== blockId)
                    };
                }
                return bl;
            });

            // Filter out all deleted blocks
            return updatedBlocks.filter(bl => !idsToDelete.has(bl.id));
        });

        // Remove from root blocks order if it's a root block
        setRootBlocksOrder(prevOrder =>
            prevOrder.filter(id => id !== blockId)
        );
    }, []);

    // Resize containers - this function is kept for backward compatibility but does nothing now
    const resizeContainer = useCallback((blockId, newWidthPercent) => {
        // All containers are now 100% width, so this function does nothing
    }, []);

    // Get all blocks at the root level or children of a specific parent
    const getBlocks = useCallback((parentId = null) => {
        if (parentId === null) {
            // For root level, return blocks in the order defined by rootBlocksOrder
            return rootBlocksOrder.map(blockId =>
                blocks.find(bl => bl.id === blockId)
            ).filter(Boolean);
        }

        // For children, get them in the order specified by parent's children array
        const parent = blocks.find(bl => bl.id === parentId);
        if (!parent || !parent.children) {
            return blocks.filter(block => block.parentId === parentId);
        }

        // Return children in the correct order
        return parent.children.map(childId =>
            blocks.find(bl => bl.id === childId)
        ).filter(Boolean);
    }, [blocks, rootBlocksOrder]);

    // Get a specific block by ID
    const getBlockById = useCallback((id) => {
        return blocks.find(block => block.id === id);
    }, [blocks]);

    // Get all children of a block
    const getChildrenOfBlock = useCallback((blockId) => {
        const block = blocks.find(bl => bl.id === blockId);
        if (!block || !block.children || block.children.length === 0) {
            return [];
        }

        return block.children.map(childId =>
            blocks.find(bl => bl.id === childId)
        ).filter(Boolean);
    }, [blocks]);

    // Check if container has only container children
    const hasOnlyContainerChildren = useCallback((blockId) => {
        const children = getChildrenOfBlock(blockId);
        if (children.length === 0) return false;
        return children.every(child => child.type === 'flexbox');
    }, [getChildrenOfBlock]);

    // Check if container has mixed children (blocks and containers)
    const hasMixedChildren = useCallback((blockId) => {
        const children = getChildrenOfBlock(blockId);
        if (children.length <= 1) return false;
        const hasContainers = children.some(child => child.type === 'flexbox');
        const hasBlocks = children.some(child => child.type !== 'flexbox');
        return hasContainers && hasBlocks;
    }, [getChildrenOfBlock]);

    const value = {
        blocks,
        createBlock,
        moveBlock,
        updateBlock,
        deleteBlock,
        resizeContainer,
        getBlocks,
        getBlockById,
        getChildrenOfBlock,
        hasOnlyContainerChildren,
        hasMixedChildren,
        isDragging,
        setIsDragging,
        draggedBlockId,
        setDraggedBlockId,
        selectedBlockId,
        setSelectedBlockId
    };

    return (
        <BuilderContext.Provider value={value}>
            {children}
        </BuilderContext.Provider>
    );
};
