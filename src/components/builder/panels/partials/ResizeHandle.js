import React, { useState, useEffect } from 'react';
import { VerticalRightOutlined, VerticalLeftOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * ResizeHandle component for resizing panels
 * @param {object} props - Component props
 * @param {function} props.onResize - Callback when resizing occurs
 * @param {function} props.onToggle - Callback when toggle is clicked
 * @param {boolean} props.collapsed - Whether the panel is collapsed
 * @param {number} props.minWidth - Minimum width for the panel
 * @param {number} props.maxWidth - Maximum width for the panel
 */
const ResizeHandle = ({
    onResize,
    onToggle,
    collapsed = false,
    minWidth = 200,
    maxWidth = 500
}) => {
    const [isDragging, setIsDragging] = useState(false);

    // Handle mouse down event to start resizing
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);

        // Store the initial position
        const initialX = e.clientX;

        // Handle mouse move during dragging
        function handleMouseMove(e) {
            const dx = e.clientX - initialX;
            onResize(dx);
        }

        // Handle mouse up to end dragging
        function handleMouseUp() {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        // Add event listeners for mouse move and mouse up
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    useEffect(() => {
        // Make sure to clean up event listeners
        return () => {
            document.removeEventListener('mousemove', () => { });
            document.removeEventListener('mouseup', () => { });
        };
    }, []);

    return (
        <div
            className={`resize-handle ${isDragging ? 'resizing' : ''}`}
            onMouseDown={handleMouseDown}
        >
            <div
                className="toggle-icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                }}
            >
                {collapsed ? <VerticalRightOutlined /> : <VerticalLeftOutlined />}
            </div>
            <div className="resize-bar" />
        </div>
    );
};

ResizeHandle.propTypes = {
    onResize: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    collapsed: PropTypes.bool,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number
};

export default ResizeHandle;
