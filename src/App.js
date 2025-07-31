import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MantineProvider } from '@mantine/core';
import SettingsPanel from './components/builder/panels/SettingsPanel';
import EditorPanel from './components/builder/panels/EditorPanel';
import { BuilderProvider } from './data/BuilderReducer';
// Initialize all blocks via the registry
import './components/builder/commons/BlockRegistry';

import './scss/builder/App.scss';

function App() {
  const [settingsPanelConfig, setSettingsPanelConfig] = useState({
    width: 300,
    collapsed: false
  });

  const [responsiveView, setResponsiveView] = useState('desktop');

  // Memoize handlers to prevent unnecessary re-renders
  const handleWidthChange = useCallback((newWidth) => {
    setSettingsPanelConfig(prev => ({ ...prev, width: newWidth }));
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setSettingsPanelConfig(prev => ({ ...prev, collapsed: !prev.collapsed }));
  }, []);

  const handleResponsiveViewChange = useCallback((newView) => {
    setResponsiveView(newView);
  }, []);

  return (
    <MantineProvider>
      <DndProvider backend={HTML5Backend}>
        <BuilderProvider>
          <div className="builder-layout">
            <SettingsPanel
              width={settingsPanelConfig.width}
              collapsed={settingsPanelConfig.collapsed}
              onWidthChange={handleWidthChange}
              onToggleCollapse={handleToggleCollapse}
            />
            <EditorPanel
              settingsPanelCollapsed={settingsPanelConfig.collapsed}
              responsiveView={responsiveView}
              onResponsiveViewChange={handleResponsiveViewChange}
            />
          </div>
        </BuilderProvider>
      </DndProvider>
    </MantineProvider>
  );
}

export default App;
