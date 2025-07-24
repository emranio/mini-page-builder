import React, { useState, useEffect, useRef } from 'react';
import { useBuilder } from '../../../../contexts/BuilderReducer';
import { DropZone } from '../../commons';
import { withBaseBlock } from '../../commons/base';
import ResizeBar from './ResizeBar';
import ColumnBlockSettings from './settings';

const ColumnBlockView = ({
    id,
    columns = 2,
    columnWidths = [],
    columnIds = [],
    gap = 10,
    backgroundColor = 'transparent',
    borderStyle = 'dashed',
    borderWidth = 1,
    borderColor = '#d9d9d9',
    throttledUpdate
}) => {
    const { updateBlock, createBlock, getBlockById, isDragging, setSelectedBlockId } = useBuilder();
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [currentWidths, setCurrentWidths] = useState([]);
    const isResizingRef = useRef(false);

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedBlockId(id);
    };

    // Initialize current widths only when columns change
    useEffect(() => {
        if (isResizingRef.current) return; // Don't update during resize

        if (columnWidths && columnWidths.length > 0 && columnWidths.length === columns) {
            // Validate all values are numbers
            const validWidths = columnWidths.every(width =>
                typeof width === 'number' && !isNaN(width) && width !== null && width !== undefined
            );

            if (validWidths) {
                setCurrentWidths([...columnWidths]);
            } else {
                // Create equal width columns if any value is invalid
                const equalWidth = Math.round((100 / columns) * 100) / 100;
                setCurrentWidths(Array(columns).fill(equalWidth));
            }
        } else {
            // Create equal width columns
            const equalWidth = Math.round((100 / columns) * 100) / 100;
            setCurrentWidths(Array(columns).fill(equalWidth));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columns]); // Intentionally excluding columnWidths to prevent re-render loops

    // Separate effect to handle prop changes when not resizing
    useEffect(() => {
        if (isResizingRef.current) return; // Don't update during resize

        // Only update if columnWidths actually changed and is valid
        if (columnWidths && columnWidths.length === columns) {
            const validWidths = columnWidths.every(width =>
                typeof width === 'number' && !isNaN(width) && width !== null && width !== undefined
            );

            if (validWidths) {
                setCurrentWidths([...columnWidths]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnWidths.length, columns]); // Intentionally simplified dependencies

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
                    const columnId = createBlock('flexbox', id);
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

    // Handle resizing between columns
    const handleColumnResize = (index, deltaX) => {
        const rowElement = document.querySelector(`.column-element-row[data-id="${id}"]`);
        if (!rowElement) return;

        const rowWidth = rowElement.clientWidth;
        const deltaPercentage = (deltaX / rowWidth) * 100;
        const minColumnWidth = 5;

        setCurrentWidths(prevWidths => {
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
                return newWidths; // Return unchanged if invalid index
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

            return newWidths;
        });
    };

    // Handle resize start
    const handleResizeStart = () => {
        isResizingRef.current = true;
    };

    // Handle resize end - save to global state
    const handleResizeEnd = () => {
        setTimeout(() => {
            isResizingRef.current = false;
        }, 100);

        // Only update if values actually changed
        const element = getBlockById(id);
        const currentColumnWidths = element?.props?.columnWidths || [];

        // Round the current widths to 2 decimal places
        const roundedWidths = currentWidths.map(width => Math.round(width * 100) / 100);

        const hasChanged = roundedWidths.some((width, index) =>
            Math.abs(width - (currentColumnWidths[index] || 0)) > 0.1
        );

        if (hasChanged) {
            updateBlock(id, { columnWidths: [...roundedWidths] });
        }
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

            // Create the column
            const columnContent = (
                <div
                    style={{
                        flex: '1 1 auto',
                        width: '100%',
                        minHeight: '180px',
                        display: 'flex'
                    }}
                    className="column-content"
                >
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
                    style={{
                        flex: `0 0 ${flexBasis}`,
                        maxWidth: flexBasis,
                        boxSizing: 'border-box',
                        display: 'flex',
                        position: 'relative',
                        overflow: 'visible'
                    }}
                    className="column-wrapper"
                >
                    {columnContent}
                    {resizeBar}
                </div>
            );
        });
    };

    const containerStyle = {
        margin: '10px 0',
        minHeight: '200px',
        border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        padding: '10px',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: `${gap}px`,
        alignItems: 'stretch',
        justifyContent: 'space-between',
        backgroundColor: backgroundColor === 'transparent' ? 'transparent' : backgroundColor
    };

    return (
        <div className="column-element column-element-container" onClick={handleClick}>
            <div
                className={`column-element-row ${isDragging ? 'during-drag' : ''}`}
                data-id={id}
                style={containerStyle}
            >
                {renderColumns()}
            </div>

            <ColumnBlockSettings
                open={isSettingsVisible}
                onClose={() => setIsSettingsVisible(false)}
                element={{
                    id,
                    props: {
                        columns,
                        columnWidths: currentWidths,
                        gap,
                        backgroundColor,
                        borderStyle,
                        borderWidth,
                        borderColor
                    }
                }}
                throttledUpdate={throttledUpdate}
            />
        </div>
    );
};

export default withBaseBlock(ColumnBlockView);
