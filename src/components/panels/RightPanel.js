import React from 'react';
import { Layout, Typography, Empty } from 'antd';
import { useBuilder } from '../../contexts/BuilderContext';
import { DropZone } from '../elements/commons';
import { ReactIframeProxy } from '../commons';

const { Content } = Layout;
const { Title } = Typography;

const RightPanel = () => {
    const { getElements, isDragging } = useBuilder();
    const rootElements = getElements(null); // Get elements at the root level

    return (
        <Content className="right-panel">
            <div className="panel-content">
                <Title level={3}>Email Canvas</Title>
                <ReactIframeProxy title="Email Builder Preview">
                    <div className={`canvas ${isDragging ? 'canvas-during-drag' : ''}`}>
                        <DropZone parentId={null} />
                        {rootElements.length === 0 && (
                            <Empty
                                description={isDragging ? "Drop here to add elements" : "Drag elements here to start building"}
                                className="empty-canvas"
                            />
                        )}
                    </div>
                </ReactIframeProxy>
            </div>
        </Content>
    );
};

export default RightPanel;
