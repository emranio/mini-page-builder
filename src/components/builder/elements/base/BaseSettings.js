import React from 'react';
import { Modal, Form } from 'antd';

/**
 * Abstract settings component that provides common functionality
 * Can work both as modal and inline component
 */
const BaseSettings = ({
    title,
    open,
    onCancel,
    form,
    children,
    onValuesChange,
    initialValues,
    inline = false,
    ...modalProps
}) => {
    const formContent = (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onValuesChange={onValuesChange} // Live updates on change
        >
            {children}
        </Form>
    );

    if (inline) {
        return (
            <div className="inline-settings">
                {formContent}
            </div>
        );
    }

    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            footer={null} // Remove default footer with save/cancel buttons
            destroyOnClose
            {...modalProps}
        >
            {formContent}
        </Modal>
    );
};

export default BaseSettings;
