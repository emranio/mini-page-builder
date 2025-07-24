/**
 * Block Migration Utility
 * Helps migrate existing blocks to the new BlockFactory system
 */

import fs from 'fs';
import path from 'path';

/**
 * Analyzes an existing block and provides migration suggestions
 */
export const analyzeBlock = (blockPath) => {
    const analysis = {
        blockPath,
        files: {},
        suggestions: [],
        defaultProps: {},
        redundantCode: []
    };

    // Check each file
    const files = ['index.js', 'view.js', 'settings.js', 'style.js'];

    files.forEach(file => {
        const filePath = path.join(blockPath, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            analysis.files[file] = {
                path: filePath,
                content,
                issues: analyzeFile(content, file)
            };
        }
    });

    return analysis;
};

/**
 * Analyzes individual file for migration opportunities
 */
const analyzeFile = (content, fileName) => {
    const issues = [];

    switch (fileName) {
        case 'view.js':
            if (content.includes('= memo(')) {
                issues.push({
                    type: 'redundant',
                    message: 'memo() wrapper can be removed - handled by BlockFactory',
                    suggestion: 'Remove memo() wrapper and export plain component'
                });
            }

            if (content.includes('useCallback')) {
                issues.push({
                    type: 'redundant',
                    message: 'useCallback for click handlers can be removed',
                    suggestion: 'Use onClick prop provided by BlockFactory'
                });
            }

            if (content.includes('= \'') || content.includes('= "') || content.includes('= ')) {
                issues.push({
                    type: 'redundant',
                    message: 'Default prop values found in component destructuring',
                    suggestion: 'Remove defaults - handled automatically by BlockFactory'
                });
            }
            break;

        case 'settings.js':
            if (content.includes('Form.useForm()')) {
                issues.push({
                    type: 'redundant',
                    message: 'Form creation and management can be simplified',
                    suggestion: 'Use form prop provided by BlockFactory'
                });
            }

            if (content.includes('useEffect') && content.includes('setFieldsValue')) {
                issues.push({
                    type: 'redundant',
                    message: 'Form value synchronization handled automatically',
                    suggestion: 'Remove useEffect for form updates'
                });
            }

            if (content.includes('throttledUpdate')) {
                issues.push({
                    type: 'redundant',
                    message: 'Throttled update handler provided automatically',
                    suggestion: 'Remove custom throttledUpdate handling'
                });
            }
            break;

        case 'style.js':
            const defaultMatches = content.match(/(\w+)\s*=\s*['"]\w+['"]|\d+/g);
            if (defaultMatches) {
                issues.push({
                    type: 'redundant',
                    message: 'Default values in destructuring can be removed',
                    suggestion: 'Props with defaults are provided automatically'
                });
            }
            break;

        case 'index.js':
            if (content.includes('makeBlock')) {
                issues.push({
                    type: 'migration',
                    message: 'Can be migrated to new createBlock system',
                    suggestion: 'Replace makeBlock with createBlock from BlockFactory'
                });
            }
            break;
    }

    return issues;
};

/**
 * Generates migration code for a block
 */
export const generateMigrationCode = (blockName, defaultProps, settingsConfig = {}) => {
    const pascalCase = blockName.charAt(0).toUpperCase() + blockName.slice(1);

    return {
        // New index.js
        index: `import { /* IconName */ } from '@ant-design/icons';
import ${pascalCase}BlockView from './view';
import ${pascalCase}BlockSettingsForm from './settings';
import ${pascalCase}BlockStyles from './style';
import { createBlock } from '../../commons/block/BlockFactory';

const ${pascalCase}Block = createBlock({
    type: '${blockName}',
    name: '${pascalCase}',
    category: 'content', // Update as needed
    icon: </* IconName */ />,
    view: ${pascalCase}BlockView,
    settings: ${pascalCase}BlockSettingsForm,
    style: ${pascalCase}BlockStyles,
    defaultProps: ${JSON.stringify(defaultProps, null, 8)},
    settingsConfig: ${JSON.stringify(settingsConfig, null, 8)}
});

export default ${pascalCase}Block;`,

        // Simplified view template
        view: `import React from 'react';

const ${pascalCase}BlockView = ({
    // Your props here (defaults applied automatically)
    uniqueBlockId,
    onClick
}) => {
    return (
        <div id={uniqueBlockId} onClick={onClick}>
            {/* Your component JSX here */}
        </div>
    );
};

export default ${pascalCase}BlockView;`,

        // Simplified settings template
        settings: `import React from 'react';
import { Form, Input } from 'antd';

const ${pascalCase}BlockSettingsForm = ({ form, element, initialValues }) => {
    return (
        <>
            {/* Your form fields here */}
            <Form.Item label="Example" name="example">
                <Input placeholder="Example input" />
            </Form.Item>
        </>
    );
};

export default ${pascalCase}BlockSettingsForm;`,

        // Simplified style template
        style: `const ${pascalCase}BlockStyles = (props, uniqueId) => {
    const { /* your props */ } = props; // Defaults already applied
    
    return \`
        #\${uniqueId} {
            /* Your styles here */
        }
    \`;
};

export default ${pascalCase}BlockStyles;`
    };
};

/**
 * CLI utility for block migration
 */
export const migrationCLI = {
    analyzeAll: (blocksDir) => {
        const blocks = fs.readdirSync(blocksDir)
            .filter(dir => fs.statSync(path.join(blocksDir, dir)).isDirectory());

        return blocks.map(blockName => {
            const blockPath = path.join(blocksDir, blockName);
            return {
                name: blockName,
                analysis: analyzeBlock(blockPath)
            };
        });
    },

    generateReport: (analyses) => {
        let report = '# Block Migration Report\n\n';

        analyses.forEach(({ name, analysis }) => {
            report += `## ${name} Block\n\n`;

            Object.entries(analysis.files).forEach(([fileName, fileData]) => {
                if (fileData.issues.length > 0) {
                    report += `### ${fileName}\n`;
                    fileData.issues.forEach(issue => {
                        report += `- **${issue.type}**: ${issue.message}\n`;
                        report += `  - *Suggestion*: ${issue.suggestion}\n\n`;
                    });
                }
            });

            report += '---\n\n';
        });

        return report;
    }
};

export default {
    analyzeBlock,
    generateMigrationCode,
    migrationCLI
};
