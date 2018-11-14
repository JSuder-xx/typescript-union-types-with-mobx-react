import { observable, action, computed } from 'mobx';
import {
    TodoTimeClock,
    CompleteTodo,
    InProgressTodo,
    NeverStartedTodo,
    PausedTodo,
    Todo,
    isComplete,
    minutesLoggedForTodo,
    complete,
    pause,
    start,
    create
} from "./todo";

import AddTodo = require("./add_todo");

import { partition } from "../api/models/array";
import { sum } from "../api/models/numbers";
import { msPerSecond } from "../api/models/date";

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

    public get todoTimeClock() {
        return this._todoTimeClock;
    }

    @computed public get todoLists() {
        const [completed, notCompleted] = partition<CompleteTodo, NeverStartedTodo | PausedTodo | InProgressTodo>(this._todoList, isComplete);
        return { 
            completed: completed.length > 0 ? completed : null, 
            notCompleted: notCompleted.length > 0 ? notCompleted : null
        };
    }

    @computed public get totalMinutesLogged() {
        const currentTime = this._currentTime;
        return this._todoList
            .map(todo =>
                minutesLoggedForTodo({ currentTime, todo })
            )
            .reduce<number>(sum, 0);
    }

    @computed public get totalPauses() {
        return this._todoList
            .map(todo => todo.pauseCount)
            .reduce<number>(sum, 0);
    }

    public complete(todo: InProgressTodo) {
        this._updateTodoState(todo, complete({ todo, currentTime: this._currentTime }));
    }

    public pause(todo: InProgressTodo) {
        this._updateTodoState(todo, pause({ todo, currentTime: this._currentTime }));
    }

    @computed public get startMaybe() {
        const todoTimeClock = this._todoTimeClock;
        return todoTimeClock === null
            ? (todo: PausedTodo | NeverStartedTodo) => 
                this._updateTodoState(
                    todo,
                    start({ todo, todoTimeClock })
                )            
            : null;
    }

    public get addTodo() { return this._addTodo; }

    @action private _updateCurrentTime() {
        this._currentTime = new Date();
    }

    @action private _updateTodoState<T extends Todo>(
        originalTodo: T, 
        { todo, todoTimeClock }: { todo: Todo; todoTimeClock: TodoTimeClock | null }
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
