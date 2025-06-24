import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const BuilderContext = createContext();

export const useBuilder = () => useContext(BuilderContext);

export const BuilderProvider = ({ children }) => {
    const [elements, setElements] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    // Add/remove body class when dragging state changes
    useEffect(() => {
        if (isDragging) {
            document.body.classList.add('dragging');
        } else {
            document.body.classList.remove('dragging');
        }
    }, [isDragging]);

    // Create a new element
    const createElement = useCallback((type, parentId = null, props = {}) => {
        console.log("Creating element:", type, "parentId:", parentId, "props:", props);

        const newElement = {
            id: uuidv4(),
            type,
            parentId,
            props: { ...props },
            children: type === 'flexbox' ? [] : null
        };

        console.log("New element:", newElement);

        setElements(prevElements => {
            console.log("Previous elements:", prevElements);

            // Create a new array with the new element
            const newElements = [...prevElements, newElement];

            // If it has a parent, update the parent's children array
            if (parentId) {
                const parentIndex = newElements.findIndex(el => el.id === parentId);
                if (parentIndex !== -1) {
                    // Create a new parent object with updated children array
                    newElements[parentIndex] = {
                        ...newElements[parentIndex],
                        children: [
                            ...(newElements[parentIndex].children || []),
                            newElement.id
                        ]
                    };
                }
            }

            console.log("Updated elements:", newElements);
            return newElements;
        });

        return newElement.id;
    }, []);

    // Move an element to a new parent or position
    const moveElement = useCallback((elementId, targetParentId, index) => {
        console.log(`Moving element ${elementId} to parent ${targetParentId} at index ${index}`);
        setElements(prevElements => {
            // Find the element to move and its current parent
            const elementToMove = prevElements.find(el => el.id === elementId);
            if (!elementToMove) {
                console.error(`Element with id ${elementId} not found`);
                return prevElements;
            }
            const oldParentId = elementToMove.parentId;

            // Remove from old parent's children
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

            // Add to new parent's children at the specified index
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

            console.log("Updated elements after move:", result);
            return result;
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
    }, []);    // Resize containers - this function is kept for backward compatibility but does nothing now
    const resizeContainer = useCallback((elementId, newWidthPercent) => {
        // All containers are now 100% width, so this function does nothing
        console.log(`Resize functionality removed, all containers use 100% width`);
    }, []);

    // Get all elements at the root level or children of a specific parent
    const getElements = useCallback((parentId = null) => {
        console.log("Getting elements for parentId:", parentId, "All elements:", elements);

        // Filter elements directly by their parentId property
        const result = elements.filter(element => {
            const hasMatchingParent = element.parentId === parentId;
            return hasMatchingParent;
        });

        console.log("Filtered elements:", result);
        return result;
    }, [elements]);

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
        setIsDragging
    };

    return (
        <BuilderContext.Provider value={value}>
            {children}
        </BuilderContext.Provider>
    );
};
