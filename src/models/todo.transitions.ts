import { succ } from "../api/models/numbers";
import { 
  Todo,
  TodoTimeClock, 
  NeverStartedTodo, 
  InProgressTodo, 
  CompleteTodo, 
  PausedTodo, 
  totalMinutesLoggedForTimeClock,
} from "./todo";

let _id = 1;
/** Create a new Todo in a paused state. */
export function create(taskName: string): NeverStartedTodo {
    return {
        id: _id++,
        taskName,
        minutesLoggedHistorically: 0,
        todoTimeClock: null,
        isComplete: false,
        pauseCount: 0
    };
}

/** Represents the result of transitioning a Todo from one state to the next. */
export type TodoStateTransition<TResultTodo extends Todo, TTimeClock extends null | TodoTimeClock> = {
    todo: TResultTodo;
    todoTimeClock: TTimeClock;
}

/** Complete this in-progress todo. */
export function complete({ currentTime, todo }: {
    currentTime: Date;
    todo: InProgressTodo;
}): TodoStateTransition<CompleteTodo, null> {
    return {
        todoTimeClock: null,
        todo: {
            ...todo,
            minutesLoggedHistorically: totalMinutesLoggedForTimeClock({ todoTimeClock: todo.todoTimeClock, currentTime }),
            todoTimeClock: null,
            isComplete: true
        }
    };
}

/** Pause this in-progress todo. */
export function pause({ currentTime, todo }: {
    currentTime: Date;
    todo: InProgressTodo;
}): TodoStateTransition<PausedTodo, null> {
    return {
        todoTimeClock: null,
        todo: {
            ...todo,
            todoTimeClock: null,
            pauseCount: succ(todo.pauseCount),
            minutesLoggedHistorically: totalMinutesLoggedForTimeClock({ todoTimeClock: todo.todoTimeClock, currentTime }) 
        }
    }
}

/** Start a Todo (transition to In-Progress) that is Paused or Never Started. */
export function start({ todo }: {
    todo: PausedTodo | NeverStartedTodo;
    todoTimeClock: null;
}): TodoStateTransition<InProgressTodo, TodoTimeClock> {
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
