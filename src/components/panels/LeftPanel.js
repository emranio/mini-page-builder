import React from 'react';
import { Layout, Card, Typography, Row, Col } from 'antd';
import { FontSizeOutlined, PictureOutlined, AppstoreOutlined, ColumnWidthOutlined } from '@ant-design/icons';
import { ElementItem } from '../elements/commons';
import { ItemTypes } from '../../utils/DragTypes';

const { Sider } = Layout;
const { Title } = Typography;

const LeftPanel = () => {
    const elements = [
        { type: ItemTypes.TEXT, icon: <FontSizeOutlined />, label: 'Text' },
        { type: ItemTypes.IMAGE, icon: <PictureOutlined />, label: 'Image' },
        { type: ItemTypes.FLEXBOX, icon: <AppstoreOutlined />, label: 'Container' },
        { type: ItemTypes.COLUMN, icon: <ColumnWidthOutlined />, label: 'Columns' },
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
