import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import { MantineProvider } from '@mantine/core';
import SettingsPanel from './components/builder/panels/SettingsPanel';
import EditorPanel from './components/builder/panels/EditorPanel';
import { BuilderProvider, useBuilder } from './data/BuilderReducer';
// Initialize all blocks via the registry
import './components/builder/commons/BlockRegistry';

import './scss/builder/App.scss';

// Drag overlay component for visual feedback during dragging
const DragOverlayContent = ({ draggedItem }) => {
  if (!draggedItem) return null;

  return (
    <div className="drag-overlay">
      {draggedItem.type ? (
        <div className="block-placeholder">
          {draggedItem.type.charAt(0).toUpperCase() + draggedItem.type.slice(1)} Block
        </div>
      ) : null}
    </div>
  );
};

// Main App component with drag and drop context
function AppWithDnd() {
  const {
    isDragging,
    draggedBlockId,
    setIsDragging,
    setDraggedBlockId,
    createBlock,
    moveBlock,
    getBlockById,
    getBlocks
  } = useBuilder();

  const [draggedItem, setDraggedItem] = useState(null);

  // Configure sensors for drag interactions
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activating
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setIsDragging(true);
    setDraggedBlockId(active.id);
    setDraggedItem(active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setIsDragging(false);
    setDraggedBlockId(null);
    setDraggedItem(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle different drop scenarios
    if (activeData && overData) {
      // If it's a new block being created from sidebar
      if (activeData.isNewBlock) {
        if (overData.isPositional) {
          // Dropped on a positional drop zone
          createBlock(activeData.type, overData.parentId, {}, overData.index);
        } else {
          // Dropped on a general drop zone
          const targetChildren = getBlocks(overData.parentId);
          createBlock(activeData.type, overData.parentId, {}, overData.index || targetChildren.length);
        }
      }
      // If it's an existing block being moved
      else if (activeData.blockId) {
        if (overData.isPositional) {
          // Prevent dropping into same position
          const currentChildren = getBlocks(overData.parentId);
          const currentIndex = currentChildren.findIndex(bl => bl.id === activeData.blockId);

          if (activeData.parentId === overData.parentId &&
            (currentIndex === overData.index || currentIndex === overData.index - 1)) {
            return; // Same position, no need to move
          }

          moveBlock(activeData.blockId, overData.parentId, overData.index);
        } else {
          // Dropped on a general drop zone
          const targetChildren = getBlocks(overData.parentId || overData.blockId);
          moveBlock(activeData.blockId, overData.parentId || overData.blockId, overData.index || targetChildren.length);
        }
      }
    }
  };

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
      <DragOverlay>
        <DragOverlayContent draggedItem={draggedItem} />
      </DragOverlay>
    </DndContext>
  );
}

function App() {
  return (
    <MantineProvider>
      <BuilderProvider>
        <AppWithDnd />
      </BuilderProvider>
    </MantineProvider>
  );
}

export default App;
