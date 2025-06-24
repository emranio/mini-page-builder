import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Layout } from 'antd';
import LeftPanel from './components/panels/LeftPanel';
import RightPanel from './components/panels/RightPanel';
import { BuilderProvider } from './contexts/BuilderContext';
import './styles/App.scss';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <BuilderProvider>
        <Layout className="builder-layout">
          <LeftPanel />
          <RightPanel />
        </Layout>
      </BuilderProvider>
    </DndProvider>
  );
}

export default App;
