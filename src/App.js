import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Layout } from 'antd';
import LeftPanel from './components/builder/panels/LeftPanel';
import RightPanel from './components/builder/panels/RightPanel';
import { BuilderProvider } from './contexts/BuilderReducer';
import './scss/builder/App.scss';

function App() {
  const [leftPanelConfig, setLeftPanelConfig] = useState({
    width: 300,
    collapsed: false
  });

  const [responsiveView, setResponsiveView] = useState('desktop');

  return (
    <DndProvider backend={HTML5Backend}>
      <BuilderProvider>
        <Layout className="builder-layout">
          <LeftPanel
            width={leftPanelConfig.width}
            collapsed={leftPanelConfig.collapsed}
            onWidthChange={(newWidth) => setLeftPanelConfig(prev => ({ ...prev, width: newWidth }))}
            onToggleCollapse={() => setLeftPanelConfig(prev => ({ ...prev, collapsed: !prev.collapsed }))}
          />
          <RightPanel
            leftPanelCollapsed={leftPanelConfig.collapsed}
            responsiveView={responsiveView}
            onResponsiveViewChange={setResponsiveView}
          />
        </Layout>
      </BuilderProvider>
    </DndProvider>
  );
}

export default App;
