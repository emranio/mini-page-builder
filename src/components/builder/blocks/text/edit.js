import React from 'react';
import { Text } from '@mantine/core';

const TextBlockEdit = ({
    content,
}) => {
    return (
        <>
            <Text
                className="text-block foo"
            >
                {content}
            </Text>
        </>
    );
};

export default TextBlockEdit;
