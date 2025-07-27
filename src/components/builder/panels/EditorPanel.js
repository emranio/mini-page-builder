import React from 'react';
import { Layout, Typography, Empty, Row, Col } from 'antd';
import { useBuilder } from '../../../data/BuilderReducer';
import { DropZone } from '../commons';
import { ReactIframeProxy, ResponsiveViewSelector } from './partials';

const { Content } = Layout;
const { Text } = Typography;

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
        <Content className="editor-panel">
            <div className="panel-content">
                <Row align="middle" justify="space-between" style={{ marginBottom: 5, padding: '0 5px' }}>
                    <Col>
                        <Text level={3} style={{ margin: 0, textAlign: 'center' }}>Email Canvas</Text>
                    </Col>
                    <Col>
                        <ResponsiveViewSelector
                            value={responsiveView}
                            onChange={onResponsiveViewChange}
                        />
                    </Col>
                </Row>

                <div className={`iframe-container ${centerIframe ? 'centered' : ''}`}>
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
                                <Empty
                                    description={isDragging ? "Drop here to add blocks" : "Drag blocks here to start building"}
                                    className="empty-canvas"
                                />
                            )}
                        </div>
                    </ReactIframeProxy>
                </div>
            </div>
        </Content>
    );
};

export default EditorPanel;
