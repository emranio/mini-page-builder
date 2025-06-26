import React from 'react';
import { Modal, Form } from 'antd';

/**
 * Abstract settings component that provides common modal functionality
 * All element settings should extend this component
 */
const BaseSettings = ({
    title,
    open,
    onCancel,
    form,
    children,
    onValuesChange,
    initialValues,
    ...modalProps
}) => {
    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            footer={null} // Remove default footer with save/cancel buttons
            destroyOnClose
            {...modalProps}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onValuesChange={onValuesChange} // Live updates on change
            >
                {children}
            </Form>
        </Modal>
    );
};

export default BaseSettings;
