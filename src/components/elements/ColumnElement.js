import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button, Modal, Form, Slider, InputNumber, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useBuilder } from '../../contexts/BuilderContext';
import DropZone from '../containers/DropZone';
import ResizeBar from './ResizeBar';

const ColumnElement = ({ id, columns = 2, columnWidths = [], columnIds = [] }) => {
    const { updateElement, createElement, getElementById, isDragging } = useBuilder();
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    const [form] = Form.useForm();
    const [currentWidths, setCurrentWidths] = useState([]);
    const isResizingRef = useRef(false);

    // Initialize current widths only when columns or columnWidths props change
    useEffect(() => {
        if (isResizingRef.current) return; // Don't update during resize

        if (columnWidths.length > 0) {
            setCurrentWidths([...columnWidths]);
        } else {
            // Create equal width columns
            const equalWidth = Math.floor(100 / columns);
            setCurrentWidths(Array(columns).fill(equalWidth));
        }
    }, [columns]); // Removed columnWidths dependency to prevent re-render loops

    // Separate effect to handle prop changes when not resizing
    useEffect(() => {
        if (isResizingRef.current) return; // Don't update during resize

        // Only update if columnWidths actually changed (not empty/undefined)
        if (columnWidths && columnWidths.length > 0) {
            setCurrentWidths([...columnWidths]);
        }
    }, [columnWidths.length, columnWidths.join(',')]); // Use length and join for stable comparison

    // Initialize column sub-elements if they don't exist
    useEffect(() => {
        // Get the current element to check if we have columnIds
        const element = getElementById(id);
        const currentColumnIds = element?.props?.columnIds || [];

        // If we don't have columnIds or the number of columns changed, create/update them
        if (currentColumnIds.length !== columns) {
            const newColumnIds = [...currentColumnIds];

            // If we need more columns, create them
            if (currentColumnIds.length < columns) {
                for (let i = currentColumnIds.length; i < columns; i++) {
                    // Create a new column sub-element
                    const columnId = createElement('flexbox', id);
                    newColumnIds.push(columnId);
                }
            }
            // If we need fewer columns, truncate the array (elements will be deleted by the context)
            else if (currentColumnIds.length > columns) {
                // Simply truncate the array - the deleteElement logic will be handled separately
                newColumnIds.splice(columns);
            }

            // Update the parent element with the column IDs
            updateElement(id, {
                columnIds: newColumnIds
            });
        }
    }, [id, columns, createElement, updateElement, getElementById]);

    // Handle resizing between columns
    const handleColumnResize = (index, deltaX) => {
        const rowElement = document.querySelector(`.column-element-row[data-id="${id}"]`);
        if (!rowElement) return;

        const rowWidth = rowElement.clientWidth;
        const deltaPercentage = (deltaX / rowWidth) * 100;
        const minColumnWidth = 5;

        setCurrentWidths(prevWidths => {
            const newWidths = [...prevWidths];
            let leftColNewWidth = newWidths[index] + deltaPercentage;
            let rightColNewWidth = newWidths[index + 1] - deltaPercentage;

            // Enforce minimum width constraints
            if (leftColNewWidth < minColumnWidth) {
                leftColNewWidth = minColumnWidth;
                rightColNewWidth = newWidths[index] + newWidths[index + 1] - minColumnWidth;
            } else if (rightColNewWidth < minColumnWidth) {
                rightColNewWidth = minColumnWidth;
                leftColNewWidth = newWidths[index] + newWidths[index + 1] - minColumnWidth;
            }

            newWidths[index] = Math.max(minColumnWidth, leftColNewWidth);
            newWidths[index + 1] = Math.max(minColumnWidth, rightColNewWidth);

            return newWidths;
        });
    };

    // Handle resize start
    const handleResizeStart = () => {
        isResizingRef.current = true;
    };

    // Handle resize end - save to global state
    const handleResizeEnd = () => {
        // Use setTimeout to ensure the resize flag is cleared after the state update
        setTimeout(() => {
            isResizingRef.current = false;
        }, 100); // Small delay to prevent race conditions

        // Only update if values actually changed
        const element = getElementById(id);
        const currentColumnWidths = element?.props?.columnWidths || [];
        const hasChanged = currentWidths.some((width, index) =>
            Math.abs(width - (currentColumnWidths[index] || 0)) > 0.1
        );

        if (hasChanged) {
            updateElement(id, { columnWidths: [...currentWidths] });
        }
    };

    // Handle opening the settings modal
    const showSettings = () => {
        form.setFieldsValue({
            columnCount: columns,
            columnWidths: currentWidths
        });
        setIsSettingsVisible(true);
    };

    // Handle saving settings
    const handleSettingsSave = () => {
        form.validateFields().then(values => {
            const { columnCount, columnWidths } = values;

            // Validate column widths
            // If total exceeds 100%, normalize them to ensure they sum to 100%
            const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);
            let finalWidths;

            if (totalWidth > 100) {
                // Normalize to 100%
                finalWidths = columnWidths.map(width =>
                    Math.max(5, Math.round((width / totalWidth) * 100))
                );
            } else {
                // Make sure no width is less than 5%
                finalWidths = columnWidths.map(width => Math.max(5, width));
            }

            // Update the element with new settings
            updateElement(id, {
                columns: columnCount,
                columnWidths: finalWidths
            });

            setCurrentWidths(finalWidths);
            setIsSettingsVisible(false);
        });
    };

    // Generate columns based on the current settings
    const renderColumns = () => {
        // Get the current element to access columnIds
        const element = getElementById(id);
        const currentColumnIds = element?.props?.columnIds || [];

        return Array(columns).fill(0).map((_, index) => {
            // Use the current widths for rendering
            const width = currentWidths[index] || Math.floor(100 / columns);
            // Get the column ID if it exists
            const columnId = currentColumnIds[index];

            // Calculate flex basis based on width percentage
            const flexBasis = `${width}%`;

            // Create the column
            const columnContent = (
                <div
                    style={{
                        flex: '1 1 auto',
                        width: '100%',
                        minHeight: '180px',
                        display: 'flex'
                    }}
                    className="column-content"
                >
                    <div className={`column-drop-area ${isDragging ? 'during-drag' : ''}`}>
                        {columnId ? <DropZone parentId={columnId} /> : <div className="loading">Loading column...</div>}
                    </div>
                </div>
            );

            // Add a resize bar if this is not the last column
            const resizeBar = index < columns - 1 ? (
                <ResizeBar
                    key={`resize-${id}-${index}`}
                    onResizeStart={handleResizeStart}
                    onResize={(deltaX) => handleColumnResize(index, deltaX)}
                    onResizeEnd={handleResizeEnd}
                />
            ) : null;

            // Return the column wrapper with appropriate width
            return (
                <div
                    key={`col-wrapper-${id}-${index}`}
                    style={{
                        flex: `0 0 ${flexBasis}`,
                        maxWidth: flexBasis,
                        boxSizing: 'border-box',
                        display: 'flex',
                        position: 'relative',
                        overflow: 'visible' // Allow resize bar to be visible
                    }}
                    className="column-wrapper"
                >
                    {columnContent}
                    {resizeBar}
                </div>
            );
        });
    };

    // Dynamic form items for column widths
    const renderColumnWidthFields = () => {
        const columnCount = form.getFieldValue('columnCount') || columns;

        return Array(columnCount).fill(0).map((_, index) => (
            <Form.Item
                key={`width-${index}`}
                label={`Column ${index + 1} Width (%)`}
                name={['columnWidths', index]}
                rules={[{ required: true, message: 'Please input the column width' }]}
            >
                <InputNumber
                    min={5}
                    max={95}
                    addonAfter="%"
                    style={{ width: '100%' }}
                />
            </Form.Item>
        ));
    };

    return (
        <div className="column-element column-element-container">
            <div className="column-element-header">
                <Button
                    icon={<SettingOutlined />}
                    onClick={showSettings}
                    size="small"
                    className="column-settings-button"
                >
                    Column Settings
                </Button>
            </div>

            <div
                className={`column-element-row ${isDragging ? 'during-drag' : ''}`}
                data-id={id}
                style={{
                    margin: '10px 0',
                    minHeight: '200px',
                    border: '1px dashed #d9d9d9',
                    padding: '10px',
                    width: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    alignItems: 'stretch',
                    justifyContent: 'space-between'
                }}
            >
                {renderColumns()}
            </div>

            <Modal
                title="Column Settings"
                open={isSettingsVisible}
                onOk={handleSettingsSave}
                onCancel={() => setIsSettingsVisible(false)}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        columnCount: columns,
                        columnWidths: currentWidths
                    }}
                >
                    <Form.Item
                        name="columnCount"
                        label="Number of Columns"
                        rules={[{ required: true, message: 'Please select the number of columns' }]}
                    >
                        <Slider
                            min={2}
                            max={12}
                            marks={{
                                2: '2',
                                4: '4',
                                6: '6',
                                8: '8',
                                10: '10',
                                12: '12'
                            }}
                            onChange={() => {
                                // When column count changes, reset column widths
                                setTimeout(() => {
                                    const count = form.getFieldValue('columnCount');
                                    const equalWidth = Math.floor(100 / count);
                                    form.setFieldsValue({
                                        columnWidths: Array(count).fill(equalWidth)
                                    });
                                }, 0);
                            }}
                        />
                    </Form.Item>

                    <div className="column-widths-container">
                        {renderColumnWidthFields()}
                    </div>

                    <Form.Item>
                        <Space>
                            <Button onClick={() => {
                                // Distribute column widths evenly
                                const count = form.getFieldValue('columnCount');
                                const equalWidth = Math.floor(100 / count);
                                form.setFieldsValue({
                                    columnWidths: Array(count).fill(equalWidth)
                                });
                            }}>
                                Distribute Evenly
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ColumnElement;
