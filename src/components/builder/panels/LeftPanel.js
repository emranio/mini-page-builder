import React, { useRef, useEffect } from 'react';
import { Layout, Card, Typography, Row, Col, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { ElementItem } from '../elements/commons';
import { ResizeHandle } from './partials';
import { ItemTypes } from '../../../utils/DragTypes';
import { useBuilder } from '../../../contexts/BuilderContext';
import TextElement from '../elements/text';
import ImageElement from '../elements/image';
import FlexboxElement from '../elements/flexbox';
import ColumnElement from '../elements/column';

const { Sider } = Layout;
const { Title } = Typography;

const LeftPanel = ({ width = 300, collapsed = false, onWidthChange, onToggleCollapse }) => {
    const { selectedElementId, setSelectedElementId, getElementById, updateElement } = useBuilder();
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

    const elements = [
        {
            type: ItemTypes.TEXT,
            icon: TextElement.icon,
            label: TextElement.name
        },
        {
            type: ItemTypes.IMAGE,
            icon: ImageElement.icon,
            label: ImageElement.name
        },
        {
            type: ItemTypes.FLEXBOX,
            icon: FlexboxElement.icon,
            label: FlexboxElement.name
        },
        {
            type: ItemTypes.COLUMN,
            icon: ColumnElement.icon,
            label: ColumnElement.name
        },
    ];

    // Element registry for getting settings components
    const elementRegistry = {
        text: TextElement,
        image: ImageElement,
        flexbox: FlexboxElement,
        column: ColumnElement
    };

    const selectedElement = selectedElementId ? getElementById(selectedElementId) : null;
    const selectedElementConfig = selectedElement ? elementRegistry[selectedElement.type] : null;
    const SettingsComponent = selectedElementConfig?.settings;

    // Direct update for settings without throttling to ensure changes appear instantly
    const throttledUpdate = (elementId, newProps) => {
        console.log("Updating element from settings panel:", elementId, newProps);
        updateElement(elementId, newProps);
    };

    const showElementList = () => {
        setSelectedElementId(null);
    };

    return (
        <Sider
            width={collapsed ? 0 : width}
            className={`left-panel ${collapsed ? 'collapsed' : ''}`}
            style={{ position: 'relative' }}
        >
            <div className="panel-content">
                {!collapsed && (selectedElement && SettingsComponent ? (
                    // Show settings panel
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={showElementList}
                                size="small"
                                style={{ marginRight: 8 }}
                            >
                                Elements
                            </Button>
                            <Title level={4} style={{ margin: 0 }}>
                                {selectedElementConfig.name} Settings
                            </Title>
                        </div>
                        <SettingsComponent
                            element={selectedElement}
                            throttledUpdate={throttledUpdate}
                            inline={true}
                        />
                    </>
                ) : (
                    // Show elements list
                    <>
                        <Title level={3}>Elements</Title>
                        <Card title="Drag & Drop Components" className="elements-card">
                            <Row gutter={[16, 16]}>
                                {elements.map((element, index) => (
                                    <Col span={12} key={index}>
                                        <ElementItem type={element.type} icon={element.icon} label={element.label} />
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
