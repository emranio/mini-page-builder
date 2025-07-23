import React, { useState } from 'react';
import { Input, Typography } from 'antd';
import { withBaseElement } from '../base';
import { useBuilder } from '../../../../contexts/BuilderContext';

const { Paragraph } = Typography;
const { TextArea } = Input;

const TextElementView = ({
    id,
    content = 'Click to edit text',
    fontSize = 14,
    fontWeight = 'normal',
    color = '#000000',
    textAlign = 'left',
    throttledUpdate
}) => {
    const [isEditing, setIsEditing] = useState(false);

    // Don't use local state for content, instead use the prop directly
    // and only track content changes during editing
    const [editingContent, setEditingContent] = useState(null);
    const { setSelectedElementId } = useBuilder();

    // Reset editing content when exiting edit mode or when content prop changes
    React.useEffect(() => {
        if (!isEditing) {
            setEditingContent(null);
        } else {
            // Update editing content when content changes while in edit mode
            setEditingContent(content);
        }
    }, [isEditing, content]);

    // Initialize editing content when entering edit mode
    const startEditing = () => {
        setEditingContent(content);
        setIsEditing(true);
    };

    const handleChange = (value) => {
        setEditingContent(value);
        // Only update the element when actually editing in place
        // Don't update the element props during editing to prevent re-rendering
        // Changes will be applied on blur
    };

    const handleDoubleClick = () => {
        startEditing();
    };

    const handleClick = (e) => {
        e.stopPropagation();
        setSelectedElementId(id);
    };

    const handleBlur = () => {
        // Finalize the edit
        setIsEditing(false);
        // Make sure the content is updated with our final value
        if (editingContent !== null && editingContent !== content) {
            throttledUpdate(id, { content: editingContent });
        }
    };

    // Handle key presses during editing
    const handleKeyDown = (e) => {
        // Exit editing mode when Enter is pressed (without shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleBlur();
        }
    };

    const textStyle = {
        fontSize: `${fontSize}px`,
        fontWeight,
        color,
        textAlign,
        margin: 0
    };

    // For debugging
    console.log(`TextElementView render: id=${id}, content="${content}", isEditing=${isEditing}, editingContent="${editingContent}", source="view"`);

    return isEditing ? (
        <TextArea
            autoSize
            autoFocus
            value={editingContent}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="text-element-editor"
            style={textStyle}
        />
    ) : (
        <Paragraph
            className="text-element"
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            style={textStyle}
        >
            {content || 'Click to edit text'}
        </Paragraph>
    );
};

export default withBaseElement(TextElementView);
