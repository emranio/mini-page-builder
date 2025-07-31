/**
 * Debug Data Block - No settings needed, displays live data
 */
import React from 'react';
import { Stack, Text, Title } from '@mantine/core';

const DebugDataBlockSettings = () => {
    return (
        <Stack gap="md" align="center" style={{ padding: '16px' }}>
            <Title order={4}>🐛 Debug Data Block</Title>
            <Text>This block automatically displays live data from the right panel.</Text>
            <Text>No settings required!</Text>
        </Stack>
    );
};

export default DebugDataBlockSettings;
