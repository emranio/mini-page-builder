import React from 'react';

/**
 * ExampleContainerBlockView - Simplified view for HTML generation
 * This component generates clean HTML without editing functionality
 */
const ExampleContainerBlockView = ({
    id,
    getChildrenHTML
}) => {
    // Get children content for this container
    const childrenContent = getChildrenHTML ? getChildrenHTML(id) : '';

    return (
        <div
            className="container-content"
            dangerouslySetInnerHTML={{ __html: childrenContent }}
        />
    );
};

export default ExampleContainerBlockView;
