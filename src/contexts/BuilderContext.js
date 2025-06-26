import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TextElement from '../components/elements/text';
import ImageElement from '../components/elements/image';
import FlexboxElement from '../components/elements/flexbox';
import ColumnElement from '../components/elements/column';

const BuilderContext = createContext();

export const useBuilder = () => useContext(BuilderContext);

// Element registry for getting default props
const elementRegistry = {
    text: TextElement,
    image: ImageElement,
    flexbox: FlexboxElement,
    column: ColumnElement
};

export const BuilderProvider = ({ children }) => {
    const [elements, setElements] = useState([]);
    const [rootElementsOrder, setRootElementsOrder] = useState([]); // Track order of root elements
    const [isDragging, setIsDragging] = useState(false);
    const [selectedElementId, setSelectedElementId] = useState(null);

    // Add/remove body class when dragging state changes
    useEffect(() => {
        if (isDragging) {
            document.body.classList.add('dragging');
        } else {
            document.body.classList.remove('dragging');
        }
    }, [isDragging]);

    // Create a new element
    const createElement = useCallback((type, parentId = null, props = {}, index = null) => {
        // Get default props from element registry
        const elementConfig = elementRegistry[type];
        const defaultProps = elementConfig?.defaultProps || {};

        const newElement = {
            id: uuidv4(),
            type,
            parentId,
            props: { ...defaultProps, ...props },
            children: type === 'flexbox' ? [] : null
        };

        setElements(prevElements => {
            // Create a new array with the new element
            const newElements = [...prevElements, newElement];

            // If it has a parent, update the parent's children array
            if (parentId) {
                const parentIndex = newElements.findIndex(el => el.id === parentId);
                if (parentIndex !== -1) {
                    const parentChildren = [...(newElements[parentIndex].children || [])];

                    // Insert at specific index if provided, otherwise append to end
                    if (index !== null && index >= 0 && index <= parentChildren.length) {
                        parentChildren.splice(index, 0, newElement.id);
                    } else {
                        parentChildren.push(newElement.id);
                    }

                    // Create a new parent object with updated children array
                    newElements[parentIndex] = {
                        ...newElements[parentIndex],
                        children: parentChildren
                    };
                }
            }

            return newElements;
        });

        // Handle root element ordering
        if (parentId === null) {
            setRootElementsOrder(prevOrder => {
                const newOrder = [...prevOrder];
                if (index !== null && index >= 0 && index <= newOrder.length) {
                    newOrder.splice(index, 0, newElement.id);
                } else {
                    newOrder.push(newElement.id);
                }
                return newOrder;
            });
        }

        return newElement.id;
    }, []);

    // Move an element to a new parent or position
    const moveElement = useCallback((elementId, targetParentId, index) => {
        setElements(prevElements => {
            // Find the element to move and its current parent
            const elementToMove = prevElements.find(el => el.id === elementId);
            if (!elementToMove) {
                return prevElements;
            }
            const oldParentId = elementToMove.parentId;

            // Remove from old parent's children (if not root level)
            const updatedElements = prevElements.map(el => {
                if (el.id === oldParentId) {
                    return {
                        ...el,
                        children: el.children.filter(childId => childId !== elementId)
                    };
                }
                return el;
            });

            // Update the element's parent reference
            const updatedElementToMove = {
                ...elementToMove,
                parentId: targetParentId
            };

            // Add to new parent's children at the specified index (if not root level)
            const result = updatedElements
                .map(el => {
                    if (el.id === targetParentId) {
                        const newChildren = [...(el.children || [])];
                        newChildren.splice(index, 0, elementId);
                        return {
                            ...el,
                            children: newChildren
                        };
                    }
                    return el;
                })
                .map(el => el.id === elementId ? updatedElementToMove : el);

            return result;
        });

        // Handle root element ordering changes
        setRootElementsOrder(prevOrder => {
            const newOrder = [...prevOrder];

            // Remove from old position
            const oldIndex = newOrder.indexOf(elementId);
            if (oldIndex !== -1) {
                newOrder.splice(oldIndex, 1);
            }

            // Add to new position if moving to root level
            if (targetParentId === null) {
                newOrder.splice(index, 0, elementId);
            }

            return newOrder;
        });
    }, []);

    // Update element properties
    const updateElement = useCallback((elementId, newProps) => {
        setElements(prevElements =>
            prevElements.map(element =>
                element.id === elementId
                    ? { ...element, props: { ...element.props, ...newProps } }
                    : element
            )
        );
    }, []);

    // Delete an element and its children recursively
    const deleteElement = useCallback((elementId) => {
        setElements(prevElements => {
            // Find element to delete and its parent
            const elementToDelete = prevElements.find(el => el.id === elementId);
            const parentId = elementToDelete.parentId;

            // Get all IDs to delete (including children)
            const idsToDelete = new Set([elementId]);
            const findAllChildren = (id) => {
                const element = prevElements.find(el => el.id === id);
                if (element && element.children) {
                    element.children.forEach(childId => {
                        idsToDelete.add(childId);
                        findAllChildren(childId);
                    });
                }
            };
            findAllChildren(elementId);

            // Update parent's children list
            let updatedElements = prevElements.map(el => {
                if (el.id === parentId) {
                    return {
                        ...el,
                        children: el.children.filter(childId => childId !== elementId)
                    };
                }
                return el;
            });

            // Filter out all deleted elements
            return updatedElements.filter(el => !idsToDelete.has(el.id));
        });

        // Remove from root elements order if it's a root element
        setRootElementsOrder(prevOrder =>
            prevOrder.filter(id => id !== elementId)
        );
    }, []);    // Resize containers - this function is kept for backward compatibility but does nothing now
    const resizeContainer = useCallback((elementId, newWidthPercent) => {
        // All containers are now 100% width, so this function does nothing
    }, []);

    // Get all elements at the root level or children of a specific parent
    const getElements = useCallback((parentId = null) => {
        if (parentId === null) {
            // For root level, return elements in the order defined by rootElementsOrder
            return rootElementsOrder.map(elementId =>
                elements.find(el => el.id === elementId)
            ).filter(Boolean);
        }

        // For children, get them in the order specified by parent's children array
        const parent = elements.find(el => el.id === parentId);
        if (!parent || !parent.children) {
            return elements.filter(element => element.parentId === parentId);
        }

        // Return children in the correct order
        return parent.children.map(childId =>
            elements.find(el => el.id === childId)
        ).filter(Boolean);
    }, [elements, rootElementsOrder]);

    // Get a specific element by ID
    const getElementById = useCallback((id) => {
        return elements.find(element => element.id === id);
    }, [elements]);

    // Get all children of an element
    const getChildrenOfElement = useCallback((elementId) => {
        const element = elements.find(el => el.id === elementId);
        if (!element || !element.children || element.children.length === 0) {
            return [];
        }

        return element.children.map(childId =>
            elements.find(el => el.id === childId)
        ).filter(Boolean);
    }, [elements]);

    // Check if container has only container children
    const hasOnlyContainerChildren = useCallback((elementId) => {
        const children = getChildrenOfElement(elementId);
        if (children.length === 0) return false;
        return children.every(child => child.type === 'flexbox');
    }, [getChildrenOfElement]);

    // Check if container has mixed children (elements and containers)
    const hasMixedChildren = useCallback((elementId) => {
        const children = getChildrenOfElement(elementId);
        if (children.length <= 1) return false;
        const hasContainers = children.some(child => child.type === 'flexbox');
        const hasElements = children.some(child => child.type !== 'flexbox');
        return hasContainers && hasElements;
    }, [getChildrenOfElement]);

    const value = {
        elements,
        createElement,
        moveElement,
        updateElement,
        deleteElement,
        resizeContainer,
        getElements,
        getElementById,
        getChildrenOfElement,
        hasOnlyContainerChildren,
        hasMixedChildren,
        isDragging,
        setIsDragging,
        selectedElementId,
        setSelectedElementId
    };

    return (
        <BuilderContext.Provider value={value}>
            {children}
        </BuilderContext.Provider>
    );
};
