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
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
        }

        /* Instance-specific styles */
        #${uniqueId} {
            /* Add any instance-specific styles here */
        }
    `;
};

export default DebugDataBlockStyles;
