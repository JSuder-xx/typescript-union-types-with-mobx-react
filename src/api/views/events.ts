import * as React from 'react';

/** Return a keyboard event handler that executes the given function for a specific key code. */
export function executeOnKeyCodes(keyCodes: number[], fn: () => void) {
    return (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (keyCodes.indexOf(evt.keyCode) >= 0)
            fn();
    };
}
