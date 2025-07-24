import React, { useState, useCallback } from 'react';
import { useBuilder } from '../../../../contexts/BuilderReducer';

/**
 * Abstract base class for all blocks
 * Provides common functionality like live updates with throttling
 */
class BaseBlock extends React.Component {
    constructor(props) {
        super(props);
        this.throttleTimeout = null;
        this.throttleDelay = 300; // 300ms throttle
    }

    /**
     * Throttled update function to prevent excessive API calls
     * @param {string} elementId - The element ID to update
     * @param {object} props - The props to update
     * @param {function} updateBlock - The update function from context
     */
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

/**
 * HOC for wrapping functional components with base block functionality
 */
export const withBaseBlock = (WrappedComponent) => {
    return React.forwardRef((props, ref) => {
        const { updateBlock } = useBuilder();
        const [throttleTimeout, setThrottleTimeout] = useState(null);

        const throttledUpdate = useCallback((elementId, newProps) => {
            if (throttleTimeout) {
                clearTimeout(throttleTimeout);
            }

            const newTimeout = setTimeout(() => {
                updateBlock(elementId, newProps);
            }, 300); // 300ms throttle

            setThrottleTimeout(newTimeout);
        }, [updateBlock, throttleTimeout]);

        // Cleanup on unmount
        React.useEffect(() => {
            return () => {
                if (throttleTimeout) {
                    clearTimeout(throttleTimeout);
                }
            };
        }, [throttleTimeout]);

        return (
            <WrappedComponent
                ref={ref}
                {...props}
                throttledUpdate={throttledUpdate}
            />
        );
    });
};

export default BaseBlock;
