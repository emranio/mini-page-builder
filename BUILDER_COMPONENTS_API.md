# Builder Components Global State API

This document describes the global state functions that allow you to access all components that have been added to the right panel (canvas) of the page builder.

## Overview

The global state API provides functions to retrieve builder components with various filtering and formatting options:

- **Format Options**: Return components as a flat 1D array or nested hierarchy
- **Filtering Options**: Include/exclude layout blocks (tabs, containers, columns)
- **Block Types**: Filter by specific block types (layout, field, design)

## Block Types

Each block in the system has a `blockType` property that categorizes it:

- **`layout`**: Structural blocks like tabs, containers, columns, accordion
- **`field`**: Content input blocks like text fields
- **`design`**: Visual/media blocks like images

## Usage

### Using the React Hook (Recommended)

```javascript
import { useBuilderComponents } from '../utils/builderComponents';

const MyComponent = () => {
    const {
        getAllComponents,
        getContentComponents,
        getLayoutComponents,
        getFieldComponents,
        getDesignComponents,
        getComponentsByType
    } = useBuilderComponents();

    // Get all components in nested format (default)
    const allComponents = getAllComponents();

    // Get all components as flat array excluding layout blocks
    const contentOnly = getAllComponents({ 
        format: 'flat', 
        includeLayout: false 
    });

    // Get only content components (fields + design, no layout)
    const contentComponents = getContentComponents();

    // Get specific block types
    const layoutComponents = getLayoutComponents({ format: 'flat' });
    const fieldComponents = getFieldComponents();
    const designComponents = getDesignComponents();

    // Custom filtering by block type
    const customComponents = getComponentsByType('field', { format: 'nested' });

    return (
        <div>
            {/* Use the component data */}
        </div>
    );
};
```

### Direct Functions (Outside React Components)

```javascript
import { useBuilder } from '../data/BuilderReducer';
import { 
    getAllBuilderComponents, 
    getContentComponents, 
    getComponentsByType 
} from '../utils/builderComponents';

// Get builder state first
const builderState = useBuilder();

// Use direct functions
const allComponents = getAllBuilderComponents(builderState, 'nested', true);
const contentOnly = getContentComponents(builderState, 'flat');
const layoutBlocks = getComponentsByType(builderState, 'layout', 'nested');
```

## API Reference

### Hook Functions

#### `getAllComponents(options)`
Returns all components from the canvas.

**Parameters:**
- `options.format` (string): `'nested'` | `'flat'` (default: `'nested'`)
- `options.includeLayout` (boolean): Include layout blocks (default: `true`)

**Returns:** Array of component objects

#### `getContentComponents(options)`
Returns only content components (field + design blocks, excluding layout).

**Parameters:**
- `options.format` (string): `'nested'` | `'flat'` (default: `'nested'`)

**Returns:** Array of content component objects

#### `getComponentsByType(blockType, options)`
Returns components filtered by specific block type.

**Parameters:**
- `blockType` (string): `'layout'` | `'field'` | `'design'`
- `options.format` (string): `'nested'` | `'flat'` (default: `'nested'`)

**Returns:** Array of component objects of specified type

#### Convenience Functions
- `getLayoutComponents(options)` - Get layout blocks only
- `getFieldComponents(options)` - Get field blocks only  
- `getDesignComponents(options)` - Get design blocks only

### Component Object Structure

Each component object returned contains:

```javascript
{
    id: "unique-block-id",
    type: "text", // Block type identifier
    blockType: "field", // Block category: layout, field, design
    name: "Text", // Display name
    parentId: "parent-block-id", // null for root blocks
    props: { // Block properties
        content: "Sample text",
        fontSize: 14,
        // ... other props
    },
    children: [ // Only in nested format and if block has children
        // ... child component objects
    ]
}
```

## Format Examples

### Nested Format (Default)
Preserves the hierarchical structure of components:

```javascript
[
    {
        id: "container-1",
        type: "example-container",
        blockType: "layout",
        props: { ... },
        children: [
            {
                id: "text-1",
                type: "text", 
                blockType: "field",
                props: { content: "Hello" }
            }
        ]
    }
]
```

### Flat Format
Returns all components in a single-level array:

```javascript
[
    {
        id: "container-1",
        type: "example-container",
        blockType: "layout",
        parentId: null,
        props: { ... }
    },
    {
        id: "text-1", 
        type: "text",
        blockType: "field", 
        parentId: "container-1",
        props: { content: "Hello" }
    }
]
```

## Demo Component

A demo component is available that shows all the functions in action. You can access it by clicking the floating API button in the bottom-right corner of the page builder interface.

The demo allows you to:
- Test different format options
- Try various filtering combinations
- See real-time results of your canvas components
- View usage examples and code snippets

## Use Cases

1. **Export/Serialization**: Get flat array of all components for saving
2. **Content Analysis**: Get only content blocks for text extraction
3. **Structure Analysis**: Get nested hierarchy for tree operations
4. **Layout Operations**: Get only layout blocks for structural changes
5. **Form Generation**: Get field blocks to generate forms
6. **Media Management**: Get design blocks to manage images/assets

## Notes

- Functions return live data from the current builder state
- Results update automatically when components are added/removed/modified
- Layout blocks include: tabs, example-container, column (and future accordion)
- The API is designed to be extensible for future block types
- All functions are memoized for performance
