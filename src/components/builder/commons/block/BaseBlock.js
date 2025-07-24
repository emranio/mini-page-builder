import React, { useRef, useCallback, useEffect, memo } from 'react';
import { Modal, Form } from 'antd';
import { useBuilder } from '../../../../contexts/BuilderReducer';
import styleManager from './styleManager';

/**
 * Enhanced BaseBlock component that combines view and settings functionality
 * Provides common functionality like live updates with throttling and settings forms
 */

/**
 * BaseSettings component for rendering forms (modal or inline)
 * Optimized with React.memo to prevent unnecessary re-renders
 */
export const BaseSettings = memo(({
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
            onValuesChange={onValuesChange}
            preserve={false} // Don't preserve form values when component unmounts
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
            footer={null}
            destroyOnClose
            {...modalProps}
        >
            {formContent}
        </Modal>
    );
});

/**
 * HOC for wrapping functional components with base block functionality
 * Provides throttled updates, style management, and unique ID generation
 * Optimized for performance with proper memoization
 */
export const withBaseBlock = (WrappedComponent, blockType = null) => {
    const MemoizedComponent = memo(WrappedComponent);

    const EnhancedComponent = React.forwardRef((props, ref) => {
        const { updateBlock } = useBuilder();
        const throttleTimeoutRef = useRef(null);
        const { id } = props;

        const throttledUpdate = useCallback((elementId, newProps) => {
            if (throttleTimeoutRef.current) {
                clearTimeout(throttleTimeoutRef.current);
            }

            throttleTimeoutRef.current = setTimeout(() => {
                updateBlock(elementId, newProps);
                throttleTimeoutRef.current = null;
            }, 300); // 300ms throttle
        }, [updateBlock]);

        // Generate unique block ID - memoized to prevent recalculation
        const uniqueBlockId = React.useMemo(() =>
            styleManager.generateBlockId(id), [id]
        );

        // Update styles when props change - optimized dependency array
        useEffect(() => {
            if (blockType && id) {
                styleManager.updateBlockStyles(id, blockType, props);
            }
        }, [props, id]);

        // Cleanup styles on unmount
        useEffect(() => {
            return () => {
                if (throttleTimeoutRef.current) {
                    clearTimeout(throttleTimeoutRef.current);
                }
                if (id) {
                    styleManager.removeBlockStyles(id);
                }
            };
        }, [id]);

        return (
            <MemoizedComponent
                ref={ref}
                {...props}
                throttledUpdate={throttledUpdate}
                uniqueBlockId={uniqueBlockId}
            />
        );
    });

    return EnhancedComponent;
};

/**
 * Legacy class component for backward compatibility
 * @deprecated Use withBaseBlock HOC instead
 */
class BaseBlock extends React.Component {
    constructor(props) {
        super(props);
        this.throttleTimeout = null;
        this.throttleDelay = 300;
    }

    throttledUpdate = (elementId, props, updateBlock) => {
        if (this.throttleTimeout) {
            clearTimeout(this.throttleTimeout);
        }

        this.throttleTimeout = setTimeout(() => {
            updateBlock(elementId, props);
        }, this.throttleDelay);
    };

    componentWillUnmount() {
        if (this.throttleTimeout) {
            clearTimeout(this.throttleTimeout);
        }
    }
}

export default BaseBlock;
