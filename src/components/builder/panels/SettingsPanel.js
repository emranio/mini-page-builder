import React, { useRef, useEffect } from 'react';
import { Card, Title, Group, Button, Stack } from '@mantine/core';
import IconArrowLeft from '@tabler/icons-react/dist/esm/icons/IconArrowLeft';
import { ResizeHandle, BlockItem } from './partials';
import { useBuilder } from '../../../data/BuilderReducer';
import { blockManager } from '../commons/block';

const SettingsPanel = ({ width = 300, collapsed = false, onWidthChange, onToggleCollapse }) => {
    const { selectedBlockId, setSelectedBlockId, getBlockById, updateBlock } = useBuilder();
    const lastWidthRef = useRef(width);

    // Store the last non-collapsed width
    useEffect(() => {
        if (!collapsed) {
            lastWidthRef.current = width;
        }
    }, [collapsed, width]);

    const handleResize = (dx) => {
        const newWidth = Math.max(200, Math.min(500, width + dx));
        onWidthChange(newWidth);
    };

    // Get all blocks from BlockManager
    const blocks = blockManager.getAllBlocks().map(block => ({
        type: block.name,
        icon: block.icon,
        label: block.title
    }));

    // Use BlockManager for getting settings components
    const blockRegistry = {}; // Convert to object for easier lookup
    blockManager.getAllBlocks().forEach(block => {
        blockRegistry[block.name] = block;
    });

    const selectedBlock = selectedBlockId ? getBlockById(selectedBlockId) : null;
    const selectedBlockConfig = selectedBlock ? blockRegistry[selectedBlock.type] : null;
    const SettingsComponent = selectedBlockConfig?.settings;

    // Direct update for settings without throttling to ensure changes appear instantly
    const throttledUpdate = (blockId, newProps) => {
        updateBlock(blockId, newProps);
    };

    const showBlockList = () => {
        setSelectedBlockId(null);
    };

    return (
        <div
            className={`settings-panel ${collapsed ? 'collapsed' : ''}`}
            style={{
                width: collapsed ? 0 : width,
                position: 'relative',
                backgroundColor: '#fafafa',
                borderLeft: '1px solid #e9ecef',
                overflow: collapsed ? 'hidden' : 'visible'
            }}
        >
            <div className="panel-content" style={{ padding: collapsed ? 0 : '16px' }}>
                {!collapsed && (selectedBlock && SettingsComponent ? (
                    // Show settings panel
                    <Stack gap="md">
                        <Group align="center" gap="xs">
                            <Button
                                leftSection={<IconArrowLeft size={16} />}
                                onClick={showBlockList}
                                size="xs"
                                variant="subtle"
                            >
                                Blocks
                            </Button>
                            <Title order={4} style={{ margin: 0, flex: 1 }}>
                                {selectedBlockConfig.title} Settings
                            </Title>
                        </Group>
                        <SettingsComponent
                            element={selectedBlock}
                            throttledUpdate={throttledUpdate}
                            inline={true}
                        />
                    </Stack>
                ) : (
                    // Show blocks list
                    <Stack gap="md">
                        <Title order={3}>Blocks</Title>
                        <Card withBorder padding="md">
                            <Card.Section withBorder p="xs">
                                <Title order={5}>Drag & Drop Components</Title>
                            </Card.Section>
                            <div className="blocks-grid">
                                {blocks.map((block, index) => (
                                    <BlockItem
                                        key={index}
                                        type={block.type}
                                        icon={block.icon}
                                        label={block.label}
                                    />
                                ))}
                            </div>
                        </Card>
                    </Stack>
                ))}
            </div>
            <ResizeHandle
                onResize={handleResize}
                onToggle={onToggleCollapse}
                collapsed={collapsed}
                minWidth={200}
                maxWidth={500}
            />
        </div>
    );
};

export default SettingsPanel;
