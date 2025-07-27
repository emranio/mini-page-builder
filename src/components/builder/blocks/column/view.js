import React from 'react';

/**
 * ColumnBlockView - Simplified view for HTML generation
 * This component generates clean HTML without editing functionality
 */
const ColumnBlockView = ({
    columns,
    columnWidths,
    columnIds,
    getChildrenHTML,
    id
}) => {
    // Generate column layout HTML structure
    const renderColumns = () => {
        const columnsArray = [];

        for (let i = 0; i < columns; i++) {
            const width = columnWidths?.[i] || Math.floor(100 / columns);
            const columnId = columnIds?.[i];

            // Get children content for this column
            const columnContent = columnId && getChildrenHTML ? getChildrenHTML(columnId) : '';

            columnsArray.push(
                <div
                    key={i}
                    className="column-wrapper"
                    style={{
                        flex: `0 0 ${width}%`,
                        maxWidth: `${width}%`
                    }}
                    dangerouslySetInnerHTML={{ __html: columnContent }}
                />
            );
        }

        return columnsArray;
    };

    return (
        <div className="column-element-row">
            {renderColumns()}
        </div>
    );
};

export default ColumnBlockView;