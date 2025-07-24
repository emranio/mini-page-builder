# BuilderContext to BuilderReducer Migration

## Overview
Successfully converted the BuilderContext from multiple useState hooks to a single useReducer for better performance and predictable state management. The file has been renamed from `BuilderContext.js` to `BuilderReducer.js` to better reflect its new architecture.

## File Structure Changes

### Before
```
src/contexts/BuilderContext.js
```

### After
```
src/contexts/BuilderReducer.js
```

All import statements have been updated across the codebase to use the new file name.

## Key Performance Improvements

### 1. **Single State Tree with useReducer**
- **Before**: Multiple useState hooks (`blocks`, `rootBlocksOrder`, `isDragging`, `draggedBlockId`, `selectedBlockId`)
- **After**: Single state object managed by reducer
- **Benefit**: Atomic state updates, predictable state transitions

### 2. **Memoized Selectors with Optimized Lookups**
- **Before**: `useCallback` selectors that recreated on every state dependency change, using `Array.find()` for lookups
- **After**: `useMemo` selectors with `Map` for O(1) block lookups instead of O(n) array searches
- **Benefit**: Fewer unnecessary recalculations and much faster block access

### 3. **Fixed Throttling Mechanism**
- **Before**: `useCallback` with `throttleTimeout` dependency causing infinite re-render loops
- **After**: `useRef` to store timeout reference, eliminating problematic dependencies
- **Benefit**: Prevents "Maximum update depth exceeded" errors, especially with rapid color picker changes

### 4. **Stable Action References**
- **Before**: Individual `useCallback` for each action
- **After**: Single `useMemo` object containing all actions
- **Benefit**: Prevents child component re-renders due to new function references

### 5. **Memoized Context Value**
- **Before**: Plain object created on every render
- **After**: `useMemo` context value
- **Benefit**: Prevents unnecessary provider re-renders

### 6. **Optimized State Updates**
- **Before**: Multiple state setters could cause multiple re-renders
- **After**: Single dispatch with atomic state updates
- **Benefit**: Fewer re-renders, more predictable state

## Architecture Changes

### Action Types
```javascript
const ACTION_TYPES = {
    SET_DRAGGING_STATE: 'SET_DRAGGING_STATE',
    SET_DRAGGED_BLOCK_ID: 'SET_DRAGGED_BLOCK_ID',
    SET_SELECTED_BLOCK_ID: 'SET_SELECTED_BLOCK_ID',
    CREATE_BLOCK: 'CREATE_BLOCK',
    MOVE_BLOCK: 'MOVE_BLOCK',
    UPDATE_BLOCK: 'UPDATE_BLOCK',
    DELETE_BLOCK: 'DELETE_BLOCK'
};
```

### Reducer Pattern
- Pure functions for all state mutations
- Immutable state updates
- Centralized business logic

### Selector Functions
- Moved outside component scope
- Memoized based on relevant state slices
- No dependencies on React hooks

## Bug Fixes

### **Color Picker Infinite Loop Fix**
- **Problem**: "Maximum update depth exceeded" error when using color picker with fast mouse movements
- **Root Cause**: `useCallback` dependency on `throttleTimeout` state caused function recreation on every timeout change
- **Solution**: Replaced `useState` with `useRef` for timeout storage, eliminating problematic dependencies
- **Files Modified**: 
  - `BaseBlock.js` - Fixed throttling mechanism
  - `tabs/settings.js` - Improved color picker form integration

## Benefits

1. **Performance**: Fewer re-renders and recalculations
2. **Predictability**: All state changes go through reducer
3. **Debugging**: Easier to track state changes with action types
4. **Testing**: Pure reducer functions are easier to test
5. **Scalability**: Better foundation for complex state management

## Backward Compatibility

All public APIs remain the same - no breaking changes for components using the context.

## Usage Example

```javascript
const { 
    blocks, 
    createBlock, 
    updateBlock, 
    getBlocks,
    isDragging,
    setIsDragging 
} = useBuilder();

// All functions work exactly the same as before
const blockId = createBlock('text', null, { content: 'Hello' });
updateBlock(blockId, { content: 'Updated' });
```
