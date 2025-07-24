# Block Development Guide - Simplified System

## Overview

The new `BlockFactory` system eliminates the redundant code you previously had to write for every block. Instead of repeating prop defaults, form handling, memoization, and common handlers across multiple files, you now define everything in one place and the system handles the rest automatically.

## Before vs After Comparison

### Old System (Redundant)
```javascript
// index.js - had to define defaults
defaultProps: {
    content: 'Simple text block',
    fontSize: 14,
    // ... repeat defaults
}

// view.js - had to repeat defaults and common handlers
const TextBlockView = memo(({
    content = 'Simple text block',  // ❌ Repeated defaults
    fontSize = 14,                 // ❌ Repeated defaults
    // ... all defaults repeated
}) => {
    const { setSelectedBlockId } = useBuilder(); // ❌ Common code
    
    const handleClick = useCallback((e) => {      // ❌ Common handler
        e.stopPropagation();
        setSelectedBlockId(id);
    }, [id, setSelectedBlockId]);
    
    // Component logic...
});

// settings.js - had to repeat defaults and form handling
const TextBlockSettings = memo(({
    open, onClose, element, throttledUpdate, inline = false // ❌ Common props
}) => {
    const [form] = Form.useForm();                          // ❌ Common code
    
    const initialValues = useMemo(() => ({                  // ❌ Common pattern
        content: element.props?.content || 'Simple text block', // ❌ Repeated defaults
        fontSize: element.props?.fontSize || 14,               // ❌ Repeated defaults
        // ... all defaults repeated
    }), [element.props]);
    
    useEffect(() => {                                       // ❌ Common code
        form.setFieldsValue(initialValues);
    }, [form, initialValues]);
    
    const handleValuesChange = useCallback((changedValues, allValues) => { // ❌ Common handler
        throttledUpdate(element.id, allValues);
    }, [throttledUpdate, element.id]);
    
    // Form JSX...
});

// style.js - had to repeat defaults
const TextBlockStyles = (props, uniqueId) => {
    const {
        fontSize = 14,           // ❌ Repeated defaults
        fontWeight = 'normal',   // ❌ Repeated defaults
        // ... all defaults repeated
    } = props;
};
```

### New System (Clean & DRY)
```javascript
// index.js - define once, use everywhere
const TextBlock = createBlock({
    type: 'text',
    name: 'Text',
    category: 'content',
    icon: <FontSizeOutlined />,
    view: TextBlockView,
    settings: TextBlockSettingsForm,
    style: TextBlockStyles,
    defaultProps: {                    // ✅ Define once
        content: 'Simple text block',
        fontSize: 14,
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'left'
    },
    settingsConfig: {
        title: 'Text Settings',
        width: 500
    }
});

// view.js - clean and simple
const TextBlockView = ({
    content, fontSize, fontWeight, color, textAlign, // ✅ No defaults needed
    uniqueBlockId, onClick                           // ✅ Common props provided
}) => {
    return (
        <div id={uniqueBlockId}>
            <Paragraph
                className="text-block"
                onClick={onClick}  // ✅ Common handler provided
                style={{
                    fontSize: `${fontSize}px`,
                    fontWeight, color, textAlign,
                    margin: 0, cursor: 'pointer'
                }}
            >
                {content}
            </Paragraph>
        </div>
    );
};

// settings.js - just the form fields
const TextBlockSettingsForm = ({ form, element, initialValues }) => {
    return (
        <>
            <Form.Item label="Content" name="content">
                <TextArea rows={4} placeholder="Enter your text content" />
            </Form.Item>
            <Form.Item label="Font Size" name="fontSize">
                <InputNumber min={8} max={72} addonAfter="px" style={{ width: '100%' }} />
            </Form.Item>
            {/* More form fields... */}
        </>
    );
};

// style.js - no defaults needed
const TextBlockStyles = (props, uniqueId) => {
    const { fontSize, fontWeight, color, textAlign } = props; // ✅ Defaults already applied
    
    return `
        #${uniqueId} .text-block {
            font-size: ${fontSize}px;
            font-weight: ${fontWeight};
            color: ${color};
            text-align: ${textAlign};
        }
    `;
};
```

## What the BlockFactory Handles Automatically

### 1. **Prop Defaults & Merging**
- Automatically merges your `defaultProps` with runtime props
- No need to repeat defaults in view, settings, or style files
- Ensures consistency across all components

### 2. **Common View Functionality**
- `memo()` wrapper for performance optimization
- Click handlers for block selection (`onClick` prop provided)
- `useBuilder()` hook integration
- `withBaseBlock()` HOC application
- Unique ID generation and management

### 3. **Common Settings Functionality**
- Form instance creation and management
- Initial values calculation with defaults
- Form value synchronization with element props
- Throttled update handlers
- Modal/inline rendering logic
- `memo()` optimization

### 4. **Style Prop Handling**
- Automatic prop merging with defaults
- Consistent prop structure across all style functions

## Creating a New Block

### Step 1: Define Your View Component
```javascript
// blocks/myblock/view.js
import React from 'react';

const MyBlockView = ({ 
    title, size, color,           // Your custom props (with defaults applied)
    uniqueBlockId, onClick        // Common props provided by BlockFactory
}) => {
    return (
        <div id={uniqueBlockId} onClick={onClick}>
            <h2 style={{ fontSize: size, color }}>{title}</h2>
        </div>
    );
};

export default MyBlockView;
```

### Step 2: Define Your Settings Form
```javascript
// blocks/myblock/settings.js
import React from 'react';
import { Form, Input, InputNumber, Select } from 'antd';

const MyBlockSettingsForm = ({ form, element, initialValues }) => {
    return (
        <>
            <Form.Item label="Title" name="title">
                <Input placeholder="Enter title" />
            </Form.Item>
            <Form.Item label="Size" name="size">
                <InputNumber min={12} max={48} addonAfter="px" />
            </Form.Item>
            <Form.Item label="Color" name="color">
                <Input type="color" />
            </Form.Item>
        </>
    );
};

export default MyBlockSettingsForm;
```

### Step 3: Define Your Styles
```javascript
// blocks/myblock/style.js
const MyBlockStyles = (props, uniqueId) => {
    const { title, size, color } = props; // Defaults already applied
    
    return `
        #${uniqueId} h2 {
            font-size: ${size}px;
            color: ${color};
            margin: 0;
            cursor: pointer;
        }
    `;
};

export default MyBlockStyles;
```

### Step 4: Register Your Block
```javascript
// blocks/myblock/index.js
import { StarOutlined } from '@ant-design/icons';
import MyBlockView from './view';
import MyBlockSettingsForm from './settings';
import MyBlockStyles from './style';
import { createBlock } from '../../commons/block/BlockFactory';

const MyBlock = createBlock({
    type: 'myblock',
    name: 'My Block',
    category: 'content',
    icon: <StarOutlined />,
    view: MyBlockView,
    settings: MyBlockSettingsForm,
    style: MyBlockStyles,
    defaultProps: {              // ✅ Define once, used everywhere
        title: 'My Block Title',
        size: 24,
        color: '#333333'
    },
    settingsConfig: {            // Optional settings customization
        title: 'My Block Settings',
        width: 400
    }
});

export default MyBlock;
```

## Migration Guide

To migrate existing blocks to the new system:

1. **Update index.js**: Change `makeBlock` to `createBlock` and add `settingsConfig` if needed
2. **Simplify view.js**: Remove memo, useCallback, useState, defaults, and common handlers
3. **Simplify settings.js**: Keep only the form fields, remove all boilerplate
4. **Simplify style.js**: Remove default prop destructuring

## Advanced Features

### Custom Settings Configuration
```javascript
settingsConfig: {
    title: 'Custom Title',
    width: 600,
    destroyOnClose: false,
    // Any Modal props supported
}
```

### Conditional Form Fields
```javascript
const MyBlockSettingsForm = ({ form, element, initialValues }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    
    return (
        <>
            <Form.Item label="Basic Setting" name="basic">
                <Input />
            </Form.Item>
            
            <Button onClick={() => setShowAdvanced(!showAdvanced)}>
                Toggle Advanced
            </Button>
            
            {showAdvanced && (
                <Form.Item label="Advanced Setting" name="advanced">
                    <InputNumber />
                </Form.Item>
            )}
        </>
    );
};
```

### Custom Validation
```javascript
<Form.Item 
    label="Email" 
    name="email"
    rules={[
        { required: true, message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' }
    ]}
>
    <Input />
</Form.Item>
```

## Benefits

1. **90% Less Boilerplate**: No more repetitive code across files
2. **Consistency**: All blocks behave the same way automatically
3. **Maintainability**: Changes to common functionality update all blocks
4. **Developer Experience**: Focus on block logic, not infrastructure
5. **Performance**: Automatic optimization with memo and proper dependency management
6. **Type Safety**: Better prop management and validation

## Common Patterns

### Computed Props
```javascript
const MyBlockView = ({ width, height, uniqueBlockId, onClick }) => {
    const aspectRatio = width / height; // Compute from props
    
    return (
        <div 
            id={uniqueBlockId} 
            onClick={onClick}
            style={{ aspectRatio }}
        >
            Content
        </div>
    );
};
```

### Conditional Rendering
```javascript
const MyBlockView = ({ showTitle, title, uniqueBlockId, onClick }) => {
    return (
        <div id={uniqueBlockId} onClick={onClick}>
            {showTitle && <h2>{title}</h2>}
            <p>Content</p>
        </div>
    );
};
```

This system makes block development much simpler and more maintainable while ensuring consistency across your entire block library.
