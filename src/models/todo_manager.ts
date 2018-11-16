import { observable, action, computed } from 'mobx';
import {
    TodoTimeClock,
    CompleteTodo,
    InProgressTodo,
    NeverStartedTodo,
    PausedTodo,
    Todo,
    isComplete,
    minutesLogged,
} from "./todo";

import {
    TodoStateTransition,
    complete,
    pause,
    start,
    create
} from "./todo.transitions";

import AddTodo = require("./add_todo");

import { Action } from "../api/models/fn";
import { partition } from "../api/models/array";
import { sumArray } from "../api/models/numbers";
import { msPerSecond } from "../api/models/date";

/**
 * Top level view model managing all Todo interactions. 
 * * Adding a Todo
 * * Todo list
 * * Todo state transitions
 * * Totals and Stats
 */
class TodoManager {

    @observable private readonly _todoList: Todo[] = [];
    @observable private _todoTimeClock: TodoTimeClock | null = null;
    @observable private _currentTime: Date = new Date();
    private readonly _addTodo = new AddTodo({
        addIncompleteTodo: (taskName) =>
            this._todoList.push(create(taskName))
    });

    constructor() {
        setInterval(
            () => this._updateCurrentTime(),
            6 * msPerSecond
        );
    }

    /** Current time-click (if there is one - if no to-do is in progress this is null). */
    public get todoTimeClock(): null | TodoTimeClock {
        return this._todoTimeClock;
    }
    
    @computed public get todoLists(): {
        completed: null | CompleteTodo[];
        notCompleted: null | (NeverStartedTodo | PausedTodo | InProgressTodo)[]
    } {
        const [completed, notCompleted] = partition<CompleteTodo, NeverStartedTodo | PausedTodo | InProgressTodo>(this._todoList, isComplete);
        return { 
            completed: completed.length > 0 ? completed : null, 
            notCompleted: notCompleted.length > 0 ? notCompleted : null
        };
    }

    @computed public get totalMinutesLogged(): number {
        const currentTime = this._currentTime;
        return sumArray(
            this._todoList.map(todo =>
                minutesLogged({ currentTime, todo })
            )
        );
    }

    /** The total number of times that all todos have been paused. */
    @computed public get totalPauses(): number {
        return sumArray(
            this._todoList.map(todo => todo.pauseCount)
        );          
    }

    /** Complete the in-progress todo. */
    public complete(todo: InProgressTodo): void {
        this._updateTodoState(todo, complete({ todo, currentTime: this._currentTime }));
    }

    /** Pause the in-progress todo. */
    public pause(todo: InProgressTodo): void {
        this._updateTodoState(todo, pause({ todo, currentTime: this._currentTime }));
    }

    /** Start a Paused | Never Started Todo when there is no currently running timeclock. */
    @computed public get startMaybe(): null | Action<PausedTodo | NeverStartedTodo> {
        const todoTimeClock = this._todoTimeClock;
        return todoTimeClock === null
            ? (todo: PausedTodo | NeverStartedTodo) => 
                this._updateTodoState(
                    todo,
                    start({ todo, todoTimeClock })
                )            
            : null;
    }

    /** Composite Add-Todo view model. */
    public get addTodo(): AddTodo { return this._addTodo; }

    @action private _updateCurrentTime(): void {
        this._currentTime = new Date();
    }

    /** 
     * Transition one to-do to a new state.
     * 
     * **NOTE** State transitions always impact the state of the running timeclock.
     */
    @action private _updateTodoState<T extends Todo>(
        originalTodo: T, 
        { todo, todoTimeClock }: TodoStateTransition<Todo, TodoTimeClock | null>
    ): void {
        const idx = this._todoList.indexOf(originalTodo);
        if (idx < 0)
            throw new Error("Unable to find todo");

        this._todoList[idx] = todo;
        this._todoTimeClock = todoTimeClock;
        this._updateCurrentTime();
    }

}

export = TodoManager;
