/**
 * Debug Data Block Styles
 */
const DebugDataBlockStyles = (uniqueId) => {
    return `
        .fildora-builder-debug-data-block {
            margin: 8px 0;
            position: relative;
        }

        .fildora-builder-debug-data-block:hover {
            background-color: rgba(24, 144, 255, 0.02);
        }

        /* Instance-specific styles */
        #${uniqueId} {
            /* Add any instance-specific styles here */
        }
    `;
};

export default DebugDataBlockStyles;
