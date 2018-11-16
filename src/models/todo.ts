import { Zero, NonZero, succ } from "../api/models/numbers";
import { minutesElapsed } from "../api/models/date";

/** A Todo item - which can be in one of four states/classifications. */
export type Todo = 
    NeverStartedTodo 
    | PausedTodo 
    | InProgressTodo 
    | CompleteTodo;

/** Running clock for a Todo item. */
export type TodoTimeClock = {
    todo(): InProgressTodo;
    readonly startTime: Date;
}

/** Returns the total minutes for the timeclock entry which includes the historical todo minutes logged and the current elapsed time on the timer. */
export const totalMinutesLoggedForTimeClock = ({ currentTime, todoTimeClock }: {
    currentTime: Date;
    todoTimeClock: TodoTimeClock;
}): number =>
    todoTimeClock.todo().minutesLoggedHistorically 
    + minutesElapsed({ currentTime, startTime: todoTimeClock.startTime });

/** Return the minutes logged for the todo. */
export const minutesLogged = ({ currentTime, todo }: {
    currentTime: Date;
    todo: Todo;
}): number =>
    isInProgress(todo)     
        ? totalMinutesLoggedForTimeClock({ todoTimeClock: todo.todoTimeClock, currentTime })
        : todo.minutesLoggedHistorically;
        
/** Properties common to all Todo representations. */
type BaseTodo = Readonly<{
    id: number;
    taskName: string;
    minutesLoggedHistorically: number;    
    pauseCount: Zero | NonZero;
}>

/** A Todo item that is incomplete, not currently being work, and has never been paused. */
export type NeverStartedTodo = BaseTodo & Readonly<{ 
    todoTimeClock: null;
    isComplete: false; 
    pauseCount: Zero;
}>;
export function isNeverStarted(todo: Todo): todo is NeverStartedTodo {
    return todo.todoTimeClock === null
        && todo.pauseCount === 0
        && !todo.isComplete;
}

/** A Todo item that is incomplete, not currently being worked, and has been paused at some point. */
export type PausedTodo = BaseTodo & Readonly<{ 
    todoTimeClock: null;
    isComplete: false; 
    pauseCount: NonZero;
}>;

export function isPaused(todo: Todo): todo is PausedTodo {
    return todo.todoTimeClock === null
        && todo.pauseCount > 0
        && !todo.isComplete;
}

/** A Todo item that is incomplete and currently being worked. */
export type InProgressTodo = BaseTodo & Readonly<{
    todoTimeClock: TodoTimeClock;
    isComplete: false;
}>

export function isInProgress(todo: Todo): todo is InProgressTodo {
    return todo.todoTimeClock !== null
        && !todo.isComplete;
}

/** A Todo item that is complete. */
export type CompleteTodo = BaseTodo & Readonly<{
    todoTimeClock: null;
    isComplete: true;
}>

export function isComplete(todo: Todo): todo is CompleteTodo {
    return todo.isComplete;
}
