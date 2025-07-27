import React from 'react';
import { useBuilder } from '../../../../data/BuilderReducer';

const DebugDataBlockView = ({ id }) => {
    const { getAllBuilderComponents, getContentComponents, getComponentsByBlockType, getAllBlocksCSS, getAppliedCSS } = useBuilder();

    // Get all the data from the right panel
    const allComponentsNested = getAllBuilderComponents('nested', true);
    const allComponentsFlat = getAllBuilderComponents('flat', true);
    const contentOnly = getAllBuilderComponents('flat', false);
    const layoutComponents = getComponentsByBlockType('layout', 'flat');
    const fieldComponents = getComponentsByBlockType('field', 'flat');
    const designComponents = getComponentsByBlockType('design', 'flat');

    // Get CSS data
    const allBlocksCSS = getAllBlocksCSS();
    const appliedCSS = getAppliedCSS();

    const data = {
        'All Components (Nested)': allComponentsNested,
        'All Components (Flat)': allComponentsFlat,
        'Content Only (No Layout)': contentOnly,
        'Layout Components': layoutComponents,
        'Field Components': fieldComponents,
        'Design Components': designComponents,
        'Generated CSS (All Blocks)': allBlocksCSS,
        'Applied CSS (DOM)': appliedCSS,
        'Statistics': {
            totalComponents: allComponentsFlat.length,
            layoutBlocks: layoutComponents.length,
            fieldBlocks: fieldComponents.length,
            designBlocks: designComponents.length,
            contentBlocks: contentOnly.length,
            cssLength: allBlocksCSS.length,
            appliedCssLength: appliedCSS.length
        }
    };

    return (
        <div style={{
            background: '#f5f5f5',
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '12px',
            maxHeight: '400px',
            overflow: 'auto'
        }}>
            <h3 style={{
                margin: '0 0 16px 0',
                fontFamily: 'sans-serif',
                color: '#1890ff',
                borderBottom: '2px solid #1890ff',
                paddingBottom: '8px'
            }}>
                🐛 Right Panel Block Data Debug
            </h3>

            <div style={{ marginBottom: '16px', fontFamily: 'sans-serif', fontSize: '14px' }}>
                <strong>📊 Quick Stats:</strong><br />
                Total: {data.Statistics.totalComponents} |
                Layout: {data.Statistics.layoutBlocks} |
                Fields: {data.Statistics.fieldBlocks} |
                Design: {data.Statistics.designBlocks} |
                CSS: {data.Statistics.cssLength} chars
            </div>

            <pre style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: '1.4'
            }}>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
};

export default DebugDataBlockView;
