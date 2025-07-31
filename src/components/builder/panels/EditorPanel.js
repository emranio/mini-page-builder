import React from 'react';
import { Text, Stack } from '@mantine/core';
import { useBuilder } from '../../../data/BuilderReducer';
import { DropZone } from '../commons';

const EditorPanel = () => {
    const { getBlocks, isDragging } = useBuilder();
    const rootBlocks = getBlocks(null); // Get blocks at the root level

    return (
        <div className="editor-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="panel-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: 10, padding: '0 10px', textAlign: 'center' }}>
                    <Text size="lg" fw={500}>Email Canvas</Text>
                </div>

                <div className="canvas-container" style={{ flex: 1, padding: '0 10px' }}>
                    <div className={`canvas ${isDragging ? 'canvas-during-drag' : ''}`} style={{
                        minHeight: '100%',
                        background: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        padding: '20px'
                    }}>
                        <DropZone parentId={null} />
                        {rootBlocks.length === 0 && (
                            <Stack align="center" justify="center" gap="xs" className="empty-canvas" style={{ minHeight: '200px', color: '#999' }}>
                                <Text size="sm" c="dimmed">
                                    {isDragging ? "Drop here to add blocks" : "Drag blocks here to start building"}
                                </Text>
                            </Stack>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPanel;
