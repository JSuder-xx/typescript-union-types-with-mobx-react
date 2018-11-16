import * as React from 'react';
import { ThunkAction } from "../models/fn";

/** Create a button that is conditionally [dis/en]abled based upon when the action is available. */
export const buttonForAction = (caption: string, action: null | ThunkAction) =>
    action === null
        ? <button disabled={true}>{caption}</button>
        : <button onClick={action}>{caption}</button>;
 