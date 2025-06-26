import React from 'react';
import { Layout, Card, Typography, Row, Col } from 'antd';
import { ElementItem } from '../elements/commons';
import { ItemTypes } from '../../utils/DragTypes';
import TextElement from '../elements/text';
import ImageElement from '../elements/image';
import FlexboxElement from '../elements/flexbox';
import ColumnElement from '../elements/column';

const { Sider } = Layout;
const { Title } = Typography;

const LeftPanel = () => {
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

    return (
        <Sider width={300} className="left-panel">
            <div className="panel-content">
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
            </div>
        </Sider>
    );
};

export default LeftPanel;
