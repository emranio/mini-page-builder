import React from 'react';
import { Layout, Card, Typography, Row, Col, Button } from 'antd';
import { ArrowLeftOutlined, AppstoreOutlined } from '@ant-design/icons';
import { ElementItem } from '../elements/commons';
import { ItemTypes } from '../../utils/DragTypes';
import { useBuilder } from '../../contexts/BuilderContext';
import TextElement from '../elements/text';
import ImageElement from '../elements/image';
import FlexboxElement from '../elements/flexbox';
import ColumnElement from '../elements/column';

const { Sider } = Layout;
const { Title } = Typography;

const LeftPanel = () => {
    const { selectedElementId, setSelectedElementId, getElementById, updateElement } = useBuilder();

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

    // Throttled update for settings
    const throttledUpdate = (elementId, newProps) => {
        updateElement(elementId, newProps);
    };

    const showElementList = () => {
        setSelectedElementId(null);
    };

    return (
        <Sider width={300} className="left-panel">
            <div className="panel-content">
                {selectedElement && SettingsComponent ? (
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
                )}
            </div>
        </Sider>
    );
};

export default LeftPanel;
