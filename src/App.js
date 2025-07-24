import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Layout } from 'antd';
import LeftPanel from './components/builder/panels/LeftPanel';
import RightPanel from './components/builder/panels/RightPanel';
import { BuilderProvider } from './contexts/BuilderReducer';
// Initialize all blocks via the registry
import './components/builder/commons/BlockRegistry';
import './scss/builder/App.scss';

function App() {
  const [leftPanelConfig, setLeftPanelConfig] = useState({
    width: 300,
    collapsed: false
  });

  const [responsiveView, setResponsiveView] = useState('desktop');

  // Memoize handlers to prevent unnecessary re-renders
  const handleWidthChange = useCallback((newWidth) => {
    setLeftPanelConfig(prev => ({ ...prev, width: newWidth }));
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setLeftPanelConfig(prev => ({ ...prev, collapsed: !prev.collapsed }));
  }, []);

  const handleResponsiveViewChange = useCallback((newView) => {
    setResponsiveView(newView);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <BuilderProvider>
        <Layout className="builder-layout">
          <LeftPanel
            width={leftPanelConfig.width}
            collapsed={leftPanelConfig.collapsed}
            onWidthChange={handleWidthChange}
            onToggleCollapse={handleToggleCollapse}
          />
          <RightPanel
            leftPanelCollapsed={leftPanelConfig.collapsed}
            responsiveView={responsiveView}
            onResponsiveViewChange={handleResponsiveViewChange}
          />
        </Layout>
      </BuilderProvider>
    </DndProvider>
  );
}

export default App;
