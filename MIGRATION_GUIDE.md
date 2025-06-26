# Migration Guide: New Element Structure

## Overview
The mini-page-builder has been restructured to use a new standardized element format that separates concerns and provides better maintainability.

## What Changed

### Before (Old Structure)
```
elements/
├── text/
│   ├── index.js          # Simple export
│   └── TextElement.js    # Monolithic component
├── image/
│   ├── index.js          # Simple export  
│   └── ImageElement.js   # Monolithic component
└── ...
```

### After (New Structure)
```
elements/
├── base/                 # Abstract components
│   ├── BaseElement.js    # HOC with throttling
│   ├── BaseSettings.js   # Modal wrapper
│   └── index.js
├── text/
│   ├── index.js          # Element configuration
│   ├── view.js           # Visual component
│   └── settings.js       # Settings modal
├── image/
│   ├── index.js          # Element configuration
│   ├── view.js           # Visual component  
│   └── settings.js       # Settings modal
└── ...
```

## Key Improvements

### 1. Separation of Concerns
- **View Logic**: Isolated in `view.js`
- **Settings Logic**: Isolated in `settings.js`
- **Configuration**: Centralized in `index.js`

### 2. Live Settings Updates
- ❌ **Before**: Settings required save button
- ✅ **After**: Live updates with throttling (300ms)

### 3. Standardized Settings Access
- ❌ **Before**: Individual settings buttons on each element
- ✅ **After**: Unified right-click menu with "Settings" option

### 4. Enhanced Base Components
- ❌ **Before**: No reusable abstractions
- ✅ **After**: `BaseElement` HOC and `BaseSettings` component

## Migration Steps

### For Existing Elements

1. **Create new directory structure**:
   ```bash
   mkdir src/components/elements/{element-name}
   ```

2. **Split monolithic component**:
   - Extract view logic → `view.js`
   - Extract settings modal → `settings.js`
   - Create configuration → `index.js`

3. **Update imports**:
   - ElementRenderer now uses `element.view`
   - LeftPanel uses `element.icon` and `element.name`

### For New Elements

1. **Create element directory**:
   ```bash
   mkdir src/components/elements/new-element
   ```

2. **Create required files**:
   ```javascript
   // index.js - Element configuration
   const NewElement = {
       name: 'New Element',
       category: 'content',
       icon: <IconComponent />,
       view: NewElementView,
       settings: NewElementSettings,
       defaultProps: {
           // defaults here
       }
   };
   ```

   ```javascript
   // view.js - Visual component
   const NewElementView = ({ id, ...props, throttledUpdate }) => {
       // Component implementation
   };
   export default withBaseElement(NewElementView);
   ```

   ```javascript
   // settings.js - Settings modal
   const NewElementSettings = ({ open, onClose, element, throttledUpdate }) => {
       const handleValuesChange = (changedValues, allValues) => {
           throttledUpdate(element.id, allValues);
       };
       
       return (
           <BaseSettings
               title="Settings"
               open={open}
               onCancel={onClose}
               onValuesChange={handleValuesChange}
           >
               {/* Form fields */}
           </BaseSettings>
       );
   };
   ```

3. **Register in BuilderContext**:
   ```javascript
   // Add to elementRegistry in BuilderContext.js
   import NewElement from '../components/elements/new-element';
   
   const elementRegistry = {
       // ...existing elements,
       'new-element': NewElement
   };
   ```

## Breaking Changes

### ElementRenderer
- Now uses `element.view` instead of direct component imports
- Passes props via `<Component id={element.id} {...element.props} />`

### DraggableElement  
- Added settings menu item automatically
- Renders settings modal when available

### BuilderContext
- Uses default props from element registry
- createElement merges defaults with provided props

## Benefits of Migration

1. **Consistency**: All elements follow the same pattern
2. **Maintainability**: Clear separation makes code easier to manage
3. **Extensibility**: Adding new elements is straightforward
4. **User Experience**: Live updates provide immediate feedback
5. **Developer Experience**: Reduced boilerplate and clearer structure

## Testing Your Migration

1. **Start the application**: `npm start`
2. **Test element creation**: Drag elements from left panel
3. **Test settings**: Right-click elements and select "Settings"
4. **Test live updates**: Modify settings and see changes immediately
5. **Test persistence**: Verify changes are saved to state

## Common Issues & Solutions

### Settings not updating
**Problem**: Changes in settings don't reflect in canvas
**Solution**: Ensure `throttledUpdate` is called in `onValuesChange`

### Missing default props
**Problem**: New elements don't have expected properties
**Solution**: Add `defaultProps` to element configuration in `index.js`

### Import errors
**Problem**: Cannot import element components
**Solution**: Update imports to use new element structure

### Missing settings option
**Problem**: Right-click menu doesn't show settings
**Solution**: Ensure element has `settings` property in configuration

## Need Help?

- Check `ELEMENT_ARCHITECTURE.md` for detailed documentation
- Look at existing elements for examples
- Ensure ESLint passes: `npm run lint`
- Test in browser: `npm start`
