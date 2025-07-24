import React, { useRef, useState, useEffect, useCallback } from 'react';

const ResizeBar = ({ onResize, onResizeStart, onResizeEnd }) => {
    const [isDragging, setIsDragging] = useState(false);
    const startXRef = useRef(0);
    const barRef = useRef(null);
    const isDraggingRef = useRef(false);
    const rafIdRef = useRef(null);

    // Handle mouse move event with requestAnimationFrame for smoother performance
    const handleMouseMove = useCallback(
        (e) => {
            if (!isDraggingRef.current) return;

            // Cancel any pending animation frame
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }

            // Use requestAnimationFrame for smooth visual updates
            rafIdRef.current = requestAnimationFrame(() => {
                const deltaX = e.clientX - startXRef.current;
                if (deltaX !== 0 && onResize) {
                    onResize(deltaX);
                    startXRef.current = e.clientX;
                }
            });
        },
        [onResize]
    );

    // Handle mouse up event
    const handleMouseUp = useCallback(() => {
        // Cancel any pending animation frame
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }

        isDraggingRef.current = false;
        setIsDragging(false);
        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Call onResizeEnd when resize is complete
        if (onResizeEnd) {
            onResizeEnd();
        }
    }, [handleMouseMove, onResizeEnd]);

    // Handle mouse down event
    const handleMouseDown = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            isDraggingRef.current = true;
            startXRef.current = e.clientX;
            setIsDragging(true);
            document.body.style.cursor = 'col-resize';

            // Add event listeners to document to track mouse movement even outside component
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            // Call onResizeStart when resize begins
            if (onResizeStart) {
                onResizeStart();
            }
        },
        [handleMouseMove, handleMouseUp, onResizeStart]
    );

    // Cleanup event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';

            // Cancel any pending animation frame
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };
    }, [handleMouseMove, handleMouseUp]);

    return (
        <div
            ref={barRef}
            className={`resize-bar ${isDragging ? 'resizing' : ''}`}
            onMouseDown={handleMouseDown}
            title="Drag to resize columns"
        >
            <div className="resize-bar-handle"></div>
        </div>
    );
};

export default ResizeBar;
