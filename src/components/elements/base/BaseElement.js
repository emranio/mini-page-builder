import React, { useState, useCallback } from 'react';
import { useBuilder } from '../../../contexts/BuilderContext';

/**
 * Abstract base class for all elements
 * Provides common functionality like live updates with throttling
 */
class BaseElement extends React.Component {
    constructor(props) {
        super(props);
        this.throttleTimeout = null;
        this.throttleDelay = 300; // 300ms throttle
    }

    /**
     * Throttled update function to prevent excessive API calls
     * @param {string} elementId - The element ID to update
     * @param {object} props - The props to update
     * @param {function} updateElement - The update function from context
     */
    throttledUpdate = (elementId, props, updateElement) => {
        if (this.throttleTimeout) {
            clearTimeout(this.throttleTimeout);
        }

        this.throttleTimeout = setTimeout(() => {
            updateElement(elementId, props);
        }, this.throttleDelay);
    };

    componentWillUnmount() {
        if (this.throttleTimeout) {
            clearTimeout(this.throttleTimeout);
        }
    }
}

/**
 * HOC for wrapping functional components with base element functionality
 */
export const withBaseElement = (WrappedComponent) => {
    return React.forwardRef((props, ref) => {
        const { updateElement } = useBuilder();
        const [throttleTimeout, setThrottleTimeout] = useState(null);

        const throttledUpdate = useCallback((elementId, newProps) => {
            if (throttleTimeout) {
                clearTimeout(throttleTimeout);
            }

            console.log("BaseElement throttledUpdate called for", elementId, newProps);

            // Immediate update for better responsiveness
            updateElement(elementId, newProps);

            // Clear any previous timeout
            setThrottleTimeout(null);
        }, [updateElement, throttleTimeout]);

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

export default BaseElement;
