import React, { useState, useRef, useEffect } from 'react';
import { Box, Text } from '@mantine/core';

const VisualColumnResizer = ({ columns, columnWidths, onChange }) => {
    const [currentWidths, setCurrentWidths] = useState(columnWidths || []);
    const [isDragging, setIsDragging] = useState(false);
    const [dragIndex, setDragIndex] = useState(-1);
    const containerRef = useRef(null);
    const isResizingRef = useRef(false);
    const latestWidthsRef = useRef(currentWidths);

    // Keep ref in sync with state
    useEffect(() => {
        latestWidthsRef.current = currentWidths;
    }, [currentWidths]);

    // Initialize widths when props change
    useEffect(() => {
        if (columnWidths && columnWidths.length === columns) {
            setCurrentWidths([...columnWidths]);
        } else {
            const equalWidth = Math.round((100 / columns) * 100) / 100;
            const newWidths = Array(columns).fill(equalWidth);
            setCurrentWidths(newWidths);
        }
    }, [columns, columnWidths]);

    // Handle mouse down on resize handle
    const handleMouseDown = (index, e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragIndex(index);
        isResizingRef.current = true;

        const startX = e.clientX;
        const containerWidth = containerRef.current?.clientWidth || 300;
        const startWidths = [...currentWidths];

        const handleMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaPercentage = (deltaX / containerWidth) * 100;
            const minColumnWidth = 5;

            let newWidths = [...startWidths];

            // Validate that both columns exist
            if (index >= newWidths.length - 1 || index < 0) {
                return;
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

            setCurrentWidths(newWidths);
            latestWidthsRef.current = newWidths;
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setDragIndex(-1);
            isResizingRef.current = false;

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            // Call onChange to update the form with the latest widths
            if (onChange) {
                onChange([...latestWidthsRef.current]);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Generate visual columns
    const renderColumns = () => {
        return Array(columns).fill(0).map((_, index) => {
            const width = currentWidths[index] || Math.floor(100 / columns);
            const isLastColumn = index === columns - 1;

            return (
                <React.Fragment key={`visual-col-${index}`}>
                    <Box
                        style={{
                            flex: `0 0 ${width}%`,
                            height: '40px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            borderRadius: '4px',
                            margin: '0 1px'
                        }}
                    >
                        <Text size="xs" c="dimmed">
                            {width.toFixed(1)}%
                        </Text>
                    </Box>

                    {!isLastColumn && (
                        <Box
                            onMouseDown={(e) => handleMouseDown(index, e)}
                            style={{
                                width: '8px',
                                height: '40px',
                                backgroundColor: isDragging && dragIndex === index ? '#339af0' : '#868e96',
                                cursor: 'col-resize',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '2px',
                                transition: isDragging ? 'none' : 'background-color 0.2s ease',
                                zIndex: 10
                            }}
                        >
                            {/* Resize handle visual indicator */}
                            <Box
                                style={{
                                    width: '2px',
                                    height: '16px',
                                    backgroundColor: 'white',
                                    borderRadius: '1px',
                                    opacity: 0.8
                                }}
                            />
                        </Box>
                    )}
                </React.Fragment>
            );
        });
    };

    return (
        <Box>
            <Text size="sm" fw={500} mb="xs">
                Column Widths (Drag to resize)
            </Text>
            <Box
                ref={containerRef}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    minHeight: '40px',
                    userSelect: 'none',
                    cursor: isDragging ? 'col-resize' : 'default'
                }}
            >
                {renderColumns()}
            </Box>
            <Text size="xs" c="dimmed" mt="xs">
                Total: {currentWidths.reduce((sum, width) => sum + width, 0).toFixed(1)}%
            </Text>
        </Box>
    );
};

export default VisualColumnResizer;
