import React, { useEffect } from 'react';

const StyleInjector = ({ id, css }) => {
    useEffect(() => {
        if (!css || !id) return;

        // Create a unique style element ID
        const styleId = `style-${id}`;

        // Remove existing style element if it exists
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }

        // Create new style element
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;

        // Always inject into head
        document.head.appendChild(style);

        // Cleanup function to remove the style when component unmounts
        return () => {
            const styleElement = document.getElementById(styleId);
            if (styleElement) {
                styleElement.remove();
            }
        };
    }, [id, css]);

    return null; // This component doesn't render anything visible
};

export default StyleInjector;
