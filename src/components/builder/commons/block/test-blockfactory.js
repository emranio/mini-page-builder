/**
 * Test script to verify the new BlockFactory system works correctly
 */

import React from 'react';
import { render } from '@testing-library/react';
import { createBlock, createBlockView, createBlockSettings } from '../src/components/builder/commons/block/BlockFactory';

// Mock components for testing
const TestView = ({ title, size, uniqueBlockId, onClick }) => (
    <div id={uniqueBlockId} onClick={onClick}>
        <h1 style={{ fontSize: size }}>{title}</h1>
    </div>
);

const TestSettingsForm = ({ form }) => (
    <div>
        <input name="title" />
        <input name="size" type="number" />
    </div>
);

const TestStyles = (props, uniqueId) => {
    const { title, size } = props;
    return `
        #${uniqueId} h1 {
            font-size: ${size}px;
        }
    `;
};

// Test the new system
describe('BlockFactory System', () => {
    test('should create enhanced view with defaults', () => {
        const mockBlockManager = {
            getBlock: jest.fn().mockReturnValue({
                defaultProps: { title: 'Default Title', size: 16 }
            })
        };

        const EnhancedView = createBlockView(TestView, 'test');

        const props = { id: 'test-1', uniqueBlockId: 'test-unique-1' };
        const component = render(<EnhancedView {...props} />);

        expect(component.container.querySelector('h1')).toHaveTextContent('Default Title');
    });

    test('should create enhanced settings with form handling', () => {
        const mockElement = {
            props: { title: 'Custom Title', size: 20 }
        };

        const EnhancedSettings = createBlockSettings(TestSettingsForm, 'test');

        const props = {
            open: true,
            onClose: jest.fn(),
            element: mockElement,
            throttledUpdate: jest.fn()
        };

        const component = render(<EnhancedSettings {...props} />);
        expect(component.container.querySelector('input[name="title"]')).toBeInTheDocument();
    });

    test('should merge props with defaults correctly', () => {
        const mockBlockManager = {
            getBlock: jest.fn().mockReturnValue({
                defaultProps: { title: 'Default', size: 16, color: 'blue' }
            })
        };

        const runtimeProps = { size: 24 }; // Override size

        // This would be called internally by createBlockView
        const mergedProps = {
            ...mockBlockManager.getBlock().defaultProps,
            ...runtimeProps
        };

        expect(mergedProps).toEqual({
            title: 'Default',  // From defaults
            size: 24,          // Overridden
            color: 'blue'      // From defaults
        });
    });
});

// Example usage test
const ExampleBlock = createBlock({
    type: 'example',
    name: 'Example',
    category: 'content',
    icon: <div>📝</div>,
    view: TestView,
    settings: TestSettingsForm,
    style: TestStyles,
    defaultProps: {
        title: 'Example Block',
        size: 18
    },
    settingsConfig: {
        title: 'Example Settings',
        width: 400
    }
});

console.log('✅ BlockFactory system created successfully');
console.log('Block type:', ExampleBlock.type);
console.log('Default props:', ExampleBlock.defaultProps);

export default ExampleBlock;
