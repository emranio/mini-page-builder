import React, { useState, useEffect, useRef } from 'react';
import { useBuilder } from '../../../../data/BuilderReducer';
import { DropZone } from '../../commons';
import ResizeBar from './ResizeBar';

const ColumnBlockView = ({
    id,
    columns,
    columnWidths,
    uniqueBlockId
}) => {
    const { updateBlock, createBlock, getBlockById, isDragging } = useBuilder();
    const [currentWidths, setCurrentWidths] = useState([]);
    const isResizingRef = useRef(false);
    const latestWidthsRef = useRef(currentWidths);
    const deferredUpdateRef = useRef(null);

    // Initialize current widths only when columns change
    useEffect(() => {
        if (isResizingRef.current) return; // Don't update during resize

        if (columnWidths && columnWidths.length > 0 && columnWidths.length === columns) {
            // Validate all values are numbers
            const validWidths = columnWidths.every(width =>
                typeof width === 'number' && !isNaN(width) && width !== null && width !== undefined
            );

            if (validWidths) {
                const newWidths = [...columnWidths];
                setCurrentWidths(newWidths);
                latestWidthsRef.current = newWidths;
            } else {
                // Create equal width columns if any value is invalid
                const equalWidth = Math.round((100 / columns) * 100) / 100;
                const newWidths = Array(columns).fill(equalWidth);
                setCurrentWidths(newWidths);
                latestWidthsRef.current = newWidths;
            }
        } else {
            // Create equal width columns
            const equalWidth = Math.round((100 / columns) * 100) / 100;
            const newWidths = Array(columns).fill(equalWidth);
            setCurrentWidths(newWidths);
            latestWidthsRef.current = newWidths;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columns]); // Intentionally excluding columnWidths to prevent re-render loops

    // Keep the ref in sync with state
    useEffect(() => {
        latestWidthsRef.current = currentWidths;
    }, [currentWidths]);

    // Separate effect to handle prop changes when not resizing
    useEffect(() => {
        if (isResizingRef.current) return; // Don't update during resize

        // Only update if columnWidths actually changed and is valid
        if (columnWidths && columnWidths.length === columns) {
            const validWidths = columnWidths.every(width =>
                typeof width === 'number' && !isNaN(width) && width !== null && width !== undefined
            );

            if (validWidths) {
                // Check if the widths are actually different before updating
                const currentWidthsString = JSON.stringify(currentWidths.map(w => Math.round(w * 100) / 100));
                const newWidthsString = JSON.stringify(columnWidths.map(w => Math.round(w * 100) / 100));

                if (currentWidthsString !== newWidthsString) {
                    setCurrentWidths([...columnWidths]);
                    latestWidthsRef.current = [...columnWidths];
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(columnWidths), columns]); // Listen to actual values

    // Initialize column sub-elements if they don't exist
    useEffect(() => {
        const element = getBlockById(id);
        const currentColumnIds = element?.props?.columnIds || [];

        // If we don't have columnIds or the number of columns changed, create/update them
        if (currentColumnIds.length !== columns) {
            const newColumnIds = [...currentColumnIds];

            // If we need more columns, create them
            if (currentColumnIds.length < columns) {
                for (let i = currentColumnIds.length; i < columns; i++) {
                    const columnId = createBlock('container', id);
                    newColumnIds.push(columnId);
                }
            }
            // If we need fewer columns, truncate the array
            else if (currentColumnIds.length > columns) {
                newColumnIds.splice(columns);
            }

            // Update the parent element with the column IDs
            updateBlock(id, {
                columnIds: newColumnIds
            });
        }
    }, [id, columns, createBlock, updateBlock, getBlockById]);

    // Update column widths in the DOM directly for immediate visual feedback
    const updateColumnsInDOM = (newWidths) => {
        // Since BlockFactory creates wrapper with uniqueBlockId, we can still use it
        const blockElement = document.getElementById(uniqueBlockId);
        if (!blockElement) return;

        const columnWrappers = blockElement.querySelectorAll('.column-wrapper');
        columnWrappers.forEach((wrapper, idx) => {
            if (newWidths[idx]) {
                const flexBasis = `${newWidths[idx]}%`;
                wrapper.style.flex = `0 0 ${flexBasis}`;
                wrapper.style.maxWidth = flexBasis;
            }
        });
    };

    // Handle resizing between columns
    const handleColumnResize = (index, deltaX) => {
        const rowElement = document.querySelector(`.column-element-row[data-id="${id}"]`);
        if (!rowElement) return;

        const rowWidth = rowElement.clientWidth;
        const deltaPercentage = (deltaX / rowWidth) * 100;
        const minColumnWidth = 5;

        // Use the latest widths from ref as a starting point
        let prevWidths = latestWidthsRef.current.length > 0 ?
            latestWidthsRef.current :
            currentWidths;

        let newWidths = [...prevWidths];

        // Validate array length and fill with equal widths if needed
        if (newWidths.length !== columns) {
            const equalWidth = Math.round((100 / columns) * 100) / 100;
            newWidths = Array(columns).fill(equalWidth);
        }

        // Ensure all values are numbers
        newWidths = newWidths.map((width, idx) => {
            if (typeof width !== 'number' || isNaN(width) || width === null || width === undefined) {
                return Math.round((100 / columns) * 100) / 100;
            }
            return width;
        });

        // Validate that both columns exist
        if (index >= newWidths.length - 1 || index < 0) {
            return; // Exit if invalid index
        }

        let leftColNewWidth = newWidths[index] + deltaPercentage;
        let rightColNewWidth = newWidths[index + 1] - deltaPercentage;

        // Enforce minimum width constraints
        if (leftColNewWidth < minColumnWidth) {
            leftColNewWidth = minColumnWidth;
            rightColNewWidth = newWidths[index] + newWidths[index + 1] - minColumnWidth;
        } else if (rightColNewWidth < minColumnWidth) {
            rightColNewWidth = minColumnWidth;
            leftColNewWidth = newWidths[index] + newWidths[index + 1] - minColumnWidth;
        }

        newWidths[index] = Math.round(Math.max(minColumnWidth, leftColNewWidth) * 100) / 100;
        newWidths[index + 1] = Math.round(Math.max(minColumnWidth, rightColNewWidth) * 100) / 100;

        // Update our ref for the latest widths
        latestWidthsRef.current = newWidths;

        // During resizing, only update the DOM directly for performance
        updateColumnsInDOM(newWidths);

        // Cancel any pending state update
        if (deferredUpdateRef.current) {
            clearTimeout(deferredUpdateRef.current);
        }

        // Schedule a low-priority state update
        deferredUpdateRef.current = setTimeout(() => {
            if (!isResizingRef.current) {
                setCurrentWidths([...newWidths]);
            }
        }, 100);
    };

    // Handle resize start
    const handleResizeStart = () => {
        isResizingRef.current = true;

        // Cancel any pending updates
        if (deferredUpdateRef.current) {
            clearTimeout(deferredUpdateRef.current);
            deferredUpdateRef.current = null;
        }
    };

    // Handle resize end - save to global state
    const handleResizeEnd = () => {
        // Use our ref for the latest widths
        const roundedWidths = latestWidthsRef.current.map(width => Math.round(width * 100) / 100);

        // Always update the block with the current widths after resize
        updateBlock(id, { columnWidths: [...roundedWidths] });

        // Update the React state after a short delay to avoid flickering
        setTimeout(() => {
            isResizingRef.current = false;
            setCurrentWidths([...roundedWidths]);
        }, 50);
    };

    // Generate columns based on the current settings
    const renderColumns = () => {
        const element = getBlockById(id);
        const currentColumnIds = element?.props?.columnIds || [];

        return Array(columns).fill(0).map((_, index) => {
            let width = currentWidths[index];

            // Ensure width is a valid number
            if (typeof width !== 'number' || isNaN(width) || width === null || width === undefined) {
                width = Math.floor(100 / columns);
            }

            // Get the column ID if it exists
            const columnId = currentColumnIds[index];

            // Calculate flex basis based on width percentage
            const flexBasis = `${width}%`;

            // Create the column content
            const columnContent = (
                <div className="column-content">
                    <div className={`column-drop-area ${isDragging ? 'during-drag' : ''}`}>
                        {columnId ? <DropZone parentId={columnId} /> : <div className="loading">Loading column...</div>}
                    </div>
                </div>
            );

            // Add a resize bar if this is not the last column
            const resizeBar = index < columns - 1 ? (
                <ResizeBar
                    key={`resize-${id}-${index}`}
                    onResizeStart={handleResizeStart}
                    onResize={(deltaX) => handleColumnResize(index, deltaX)}
                    onResizeEnd={handleResizeEnd}
                />
            ) : null;

            // Return the column wrapper with appropriate width
            return (
                <div
                    key={`col-wrapper-${id}-${index}`}
                    style={{ flex: `0 0 ${flexBasis}`, maxWidth: flexBasis }}
                    className="column-wrapper"
                >
                    {columnContent}
                    {resizeBar}
                </div>
            );
        });
    };

    return (
        <>
            <div
                className={`column-element-row ${isDragging ? 'during-drag' : ''}`}
                data-id={id}
            >
                {renderColumns()}
            </div>
        </>
    );
};

export default ColumnBlockView;
