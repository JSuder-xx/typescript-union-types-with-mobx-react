/** Represents a side-effecting function. */
export type ThunkAction = () => void;

/** Represents a side-effecting routine accepting a single argument. */
export type Action<T> = (input: T) => void;