import React, { useRef, useState, useEffect } from 'react';

const ResizeBar = ({ onResize, onResizeEnd }) => {
    const [isDragging, setIsDragging] = useState(false);
    const startXRef = useRef(0);
    const barRef = useRef(null);
    const isDraggingRef = useRef(false);

    // Handle mouse move event
    const handleMouseMove = (e) => {
        if (!isDraggingRef.current) return;

        const deltaX = e.clientX - startXRef.current;
        if (deltaX !== 0 && onResize) {
            onResize(deltaX);
            startXRef.current = e.clientX;
        }
    };

    // Handle mouse up event
    const handleMouseUp = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // Call onResizeEnd when resize is complete
        if (onResizeEnd) {
            onResizeEnd();
        }
    };

    // Handle mouse down event
    const handleMouseDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isDraggingRef.current = true;
        startXRef.current = e.clientX;
        setIsDragging(true);
        document.body.style.cursor = 'col-resize';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Cleanup event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'default';
        };
    }, []);

    return (
        <div
            ref={barRef}
            className={`column-resize-bar ${isDragging ? 'active' : ''}`}
            onMouseDown={handleMouseDown}
            title="Drag to resize columns"
        >
            <div className="resize-bar-handle"></div>
        </div>
    );
};

export default ResizeBar;
