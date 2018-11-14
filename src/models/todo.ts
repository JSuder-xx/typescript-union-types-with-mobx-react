import { Zero, NonZero, succ } from "../api/models/numbers";
import { minutesElapsed } from "../api/models/date";

/**
 * A running clock for a Todo item. 
 */
export type TodoTimeClock = {
    /**  */
    todo(): InProgressTodo;
    readonly startTime: Date;
}

export const totalMinutesLoggedForTimeClock = ({ currentTime, todoTimeClock }: {
    currentTime: Date;
    todoTimeClock: TodoTimeClock;
}): number =>
     todoTimeClock.todo().minutesLogged 
        + minutesElapsed({ currentTime, startTime: todoTimeClock.startTime });

export type BaseTodo = Readonly<{
    id: number;
    taskName: string;
    minutesLogged: number;
    pauseCount: Zero | NonZero;
}>

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

export type InProgressTodo = BaseTodo & Readonly<{
    todoTimeClock: TodoTimeClock;
    isComplete: false;
}>

export function isInProgress(todo: Todo): todo is InProgressTodo {
    return todo.todoTimeClock !== null
        && !todo.isComplete;
}

export type CompleteTodo = BaseTodo & Readonly<{
    todoTimeClock: null;
    isComplete: true;
}>

export function isComplete(todo: Todo): todo is CompleteTodo {
    return todo.isComplete;
}

export type Todo = NeverStartedTodo | PausedTodo | InProgressTodo | CompleteTodo;

let _id = 1;
export function create(taskName: string): NeverStartedTodo {
    return {
        id: _id++,
        taskName,
        minutesLogged: 0,
        todoTimeClock: null,
        isComplete: false,
        pauseCount: 0
    };
}

export function complete({ currentTime, todo }: {
    currentTime: Date;
    todo: InProgressTodo;
}): {
    todo: CompleteTodo;
    todoTimeClock: null;
} {
    return {
        todoTimeClock: null,
        todo: {
            ...todo,
            minutesLogged: totalMinutesLoggedForTimeClock({ todoTimeClock: todo.todoTimeClock, currentTime }),
            todoTimeClock: null,
            isComplete: true
        }
    };
}

export function pause({ currentTime, todo }: {
    currentTime: Date;
    todo: InProgressTodo;
}): {
    todoTimeClock: null;
    todo: PausedTodo;
} {
    return {
        todoTimeClock: null,
        todo: {
            ...todo,
            todoTimeClock: null,
            pauseCount: succ(todo.pauseCount),
            minutesLogged: totalMinutesLoggedForTimeClock({ todoTimeClock: todo.todoTimeClock, currentTime }) 
        }
    }
}

export function start({ todo }: {
    todo: PausedTodo | NeverStartedTodo;
    todoTimeClock: null;
}): {
    todoTimeClock: TodoTimeClock;
    todo: InProgressTodo;
} {
    let inProgressTodo: InProgressTodo;
    const todoTimeClock: TodoTimeClock = {
        startTime: new Date(),
        todo: () => inProgressTodo
    }
    inProgressTodo = {
        ...todo,
        todoTimeClock
    };
    
    return { todoTimeClock, todo: inProgressTodo };
}

export const minutesLoggedForTodo = ({ currentTime, todo }: {
    currentTime: Date;
    todo: Todo;
}): number =>
    isInProgress(todo)     
        ? totalMinutesLoggedForTimeClock({ todoTimeClock: todo.todoTimeClock, currentTime })
        : todo.minutesLogged;
