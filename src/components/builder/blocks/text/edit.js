import React from 'react';
import { Text } from '@mantine/core';

const TextBlockEdit = ({
    content,
}) => {
    return (
        <>
            <Text
                className="text-block"
            >
                {content}
            </Text>
        </>
    );
};

export default TextBlockEdit;
