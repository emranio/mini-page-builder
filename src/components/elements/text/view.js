import React, { useState } from 'react';
import { Input, Typography } from 'antd';
import { withBaseElement } from '../base';

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
    const [localContent, setLocalContent] = useState(content);

    const handleChange = (value) => {
        setLocalContent(value);
        throttledUpdate(id, { content: value });
    };

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const textStyle = {
        fontSize: `${fontSize}px`,
        fontWeight,
        color,
        textAlign,
        margin: 0
    };

    return isEditing ? (
        <TextArea
            autoSize
            autoFocus
            value={localContent}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            className="text-element-editor"
            style={textStyle}
        />
    ) : (
        <Paragraph
            className="text-element"
            onDoubleClick={handleDoubleClick}
            style={textStyle}
        >
            {localContent}
        </Paragraph>
    );
};

export default withBaseElement(TextElementView);
