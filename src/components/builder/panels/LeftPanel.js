import React, { useRef, useEffect } from 'react';
import { Layout, Card, Typography, Row, Col, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { BlockItem } from '../commons';
import { ResizeHandle } from './partials';
import { useBuilder } from '../../../contexts/BuilderReducer';
import blockManager from '../../../utils/BlockManager';

const { Sider } = Layout;
const { Title } = Typography;

const LeftPanel = ({ width = 300, collapsed = false, onWidthChange, onToggleCollapse }) => {
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
        type: block.type,
        icon: block.icon,
        label: block.name
    }));

    // Use BlockManager for getting settings components
    const blockRegistry = {}; // Convert to object for easier lookup
    blockManager.getAllBlocks().forEach(block => {
        blockRegistry[block.type] = block;
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
        <Sider
            width={collapsed ? 0 : width}
            className={`left-panel ${collapsed ? 'collapsed' : ''}`}
            style={{ position: 'relative' }}
        >
            <div className="panel-content">
                {!collapsed && (selectedBlock && SettingsComponent ? (
                    // Show settings panel
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={showBlockList}
                                size="small"
                                style={{ marginRight: 8 }}
                            >
                                Blocks
                            </Button>
                            <Title level={4} style={{ margin: 0 }}>
                                {selectedBlockConfig.name} Settings
                            </Title>
                        </div>
                        <SettingsComponent
                            element={selectedBlock}
                            throttledUpdate={throttledUpdate}
                            inline={true}
                        />
                    </>
                ) : (
                    // Show blocks list
                    <>
                        <Title level={3}>Blocks</Title>
                        <Card title="Drag & Drop Components" className="blocks-card">
                            <Row gutter={[16, 16]}>
                                {blocks.map((block, index) => (
                                    <Col span={12} key={index}>
                                        <BlockItem type={block.type} icon={block.icon} label={block.label} />
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </>
                ))}
            </div>
            <ResizeHandle
                onResize={handleResize}
                onToggle={onToggleCollapse}
                collapsed={collapsed}
                minWidth={200}
                maxWidth={500}
            />
        </Sider>
    );
};

export default LeftPanel;
