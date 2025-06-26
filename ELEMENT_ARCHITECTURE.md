# Element Architecture Documentation

## New Element Structure

The mini-page-builder now follows a standardized element format that promotes maintainability and extensibility. Each element is organized into three core files within its own directory:

### Element Directory Structure
```
elements/
├── {element-name}/
│   ├── index.js      # Element configuration & metadata
│   ├── view.js       # Visual component (rendered in canvas)
│   ├── settings.js   # Settings modal component
│   └── [other files] # Additional element-specific files
```

### Core Files

#### 1. `index.js` - Element Configuration
Defines the element's metadata and exports:
- **name**: Display name shown in left panel
- **category**: Organizational category 
- **icon**: React icon component
- **view**: View component reference
- **settings**: Settings component reference
- **defaultProps**: Default properties for new instances

```javascript
import { IconComponent } from '@ant-design/icons';
import ElementView from './view';
import ElementSettings from './settings';

const Element = {
    name: 'Element Name',
    category: 'content|layout|media',
    icon: <IconComponent />,
    view: ElementView,
    settings: ElementSettings,
    defaultProps: {
        // Default properties here
    }
};

export default Element;
```

#### 2. `view.js` - Visual Component
The component rendered in the canvas:
- Wrapped with `withBaseElement` HOC for enhanced functionality
- Receives props including `throttledUpdate` for live updates
- Should be purely presentational

```javascript
import React from 'react';
import { withBaseElement } from '../base';

const ElementView = ({ 
    id, 
    // ...props from element.props,
    throttledUpdate 
}) => {
    // Component implementation
    return (
        <div>
            {/* Element content */}
        </div>
    );
};

export default withBaseElement(ElementView);
```

#### 3. `settings.js` - Settings Modal
The settings configuration panel:
- Uses `BaseSettings` component for consistent modal structure
- Implements live updates via `onValuesChange`
- No save button - changes apply immediately with throttling

```javascript
import React from 'react';
import { Form, Input } from 'antd';
import { BaseSettings } from '../base';

const ElementSettings = ({ 
    open, 
    onClose, 
    element, 
    throttledUpdate 
}) => {
    const [form] = Form.useForm();

    const handleValuesChange = (changedValues, allValues) => {
        throttledUpdate(element.id, allValues);
    };

    return (
        <BaseSettings
            title="Element Settings"
            open={open}
            onCancel={onClose}
            form={form}
            initialValues={element.props}
            onValuesChange={handleValuesChange}
        >
            {/* Form fields */}
        </BaseSettings>
    );
};

export default ElementSettings;
```

## Abstract Base Components

### BaseElement & withBaseElement HOC
Located in `elements/base/BaseElement.js`:
- Provides throttled update functionality
- Prevents excessive API calls during live updates
- 300ms throttle delay by default
- Automatic cleanup on unmount

### BaseSettings Component
Located in `elements/base/BaseSettings.js`:
- Standardized modal wrapper for all element settings
- Removes default save/cancel buttons
- Enables live updates through `onValuesChange`
- Consistent styling and behavior

## Key Features

### 1. Live Settings Updates
- Settings changes apply immediately to the canvas
- 300ms throttling prevents excessive updates
- No save button needed - seamless user experience

### 2. Unified Settings Access
- All elements have settings accessible via right-click menu
- Consistent "Settings" option in dropdown menu
- Individual element settings buttons removed

### 3. Enhanced Maintainability
- Clear separation of concerns
- Standardized file structure
- Easy to add new elements
- Consistent patterns across all elements

### 4. Extensible Architecture
- Abstract base components for common functionality
- HOC pattern for enhanced capabilities
- Plugin-like element registration
- Type-safe element registry

## Current Elements

### Text Element
- **Location**: `elements/text/`
- **Features**: Inline editing, font styling, color, alignment
- **Props**: content, fontSize, fontWeight, color, textAlign

### Image Element
- **Location**: `elements/image/`
- **Features**: URL-based images, sizing, border radius
- **Props**: src, alt, width, height, borderRadius

### Flexbox Container
- **Location**: `elements/flexbox/`
- **Features**: Layout container, styling options
- **Props**: padding, margin, backgroundColor, border properties

### Column Layout
- **Location**: `elements/column/`
- **Features**: Multi-column layout, resize handles, responsive
- **Props**: columns, columnWidths, columnIds, gap, styling

## Benefits

1. **Developer Experience**: Clear structure makes adding new elements straightforward
2. **User Experience**: Live updates provide immediate feedback
3. **Maintainability**: Standardized patterns reduce complexity
4. **Scalability**: Easy to extend with new element types
5. **Consistency**: Uniform behavior across all elements

## Future Enhancements

- Element validation system
- Custom element templates
- Element grouping and categories
- Advanced theming support
- Element import/export functionality
