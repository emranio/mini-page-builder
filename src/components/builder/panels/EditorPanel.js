import React from 'react';
import { Group, Text, Stack } from '@mantine/core';
import { useBuilder } from '../../../data/BuilderReducer';
import { DropZone } from '../commons';
import { ReactIframeProxy, ResponsiveViewSelector } from './partials';

const EditorPanel = ({ settingsPanelCollapsed, responsiveView, onResponsiveViewChange }) => {
    const { getBlocks, isDragging } = useBuilder();
    const rootBlocks = getBlocks(null); // Get blocks at the root level

    // Get width based on responsive view
    const getResponsiveWidth = () => {
        switch (responsiveView) {
            case 'mobile':
                return '375px';
            case 'tablet':
                return '768px';
            case 'desktop':
            default:
                return '100%';
        }
    };

    const iframeWidth = getResponsiveWidth();
    const centerIframe = responsiveView !== 'desktop';

    return (
        <div className="editor-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="panel-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Group justify="space-between" align="center" style={{ marginBottom: 5, padding: '0 5px' }}>
                    <Text size="lg" fw={500} style={{ margin: 0, textAlign: 'center' }}>Email Canvas</Text>
                    <ResponsiveViewSelector
                        value={responsiveView}
                        onChange={onResponsiveViewChange}
                    />
                </Group>

                <div className={`iframe-container ${centerIframe ? 'centered' : ''}`} style={{ flex: 1 }}>
                    <ReactIframeProxy
                        title="Email Builder Preview"
                        style={{
                            width: iframeWidth,
                            maxWidth: '100%',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    >
                        <div className={`canvas ${isDragging ? 'canvas-during-drag' : ''}`}>
                            <DropZone parentId={null} />
                            {rootBlocks.length === 0 && (
                                <Stack align="center" justify="center" gap="xs" className="empty-canvas" style={{ minHeight: '200px', color: '#999' }}>
                                    <Text size="sm" c="dimmed">
                                        {isDragging ? "Drop here to add blocks" : "Drag blocks here to start building"}
                                    </Text>
                                </Stack>
                            )}
                        </div>
                    </ReactIframeProxy>
                </div>
            </div>
        </div>
    );
};

export default EditorPanel;
