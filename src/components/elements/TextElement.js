import React, { useState } from 'react';
import { Input, Typography } from 'antd';
import { useBuilder } from '../../contexts/BuilderContext';

const { Paragraph } = Typography;
const { TextArea } = Input;

const TextElement = ({ id, content = 'Click to edit text', editable = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { updateElement } = useBuilder();

    const handleChange = (value) => {
        updateElement(id, { content: value });
    };

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    return isEditing ? (
        <TextArea
            autoSize
            autoFocus
            defaultValue={content}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            className="text-element-editor"
        />
    ) : (
        <Paragraph
            className="text-element"
            onDoubleClick={handleDoubleClick}
        >
            {content}
        </Paragraph>
    );
};

export default TextElement;
