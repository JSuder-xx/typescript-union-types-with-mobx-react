import { observable, action, computed } from 'mobx';
import { ThunkAction } from "../api/models/fn";

/** Represents the composite user interaction of adding a To-Do. */
class AddTodo {

    @observable private _taskName = "";

    constructor(private _injected: { 
        /** Injected strategy for adding a to-do. */
        addIncompleteTodo: (taskName: string) => void;
    }) {}

    public get taskName(): string { 
        return this._taskName; 
    }

    /** Update the candidate todo task name. When populated with more than whitespace the user will have the option to add a todo with with name. */
    @action public updateTaskName(taskName: string): void {
        this._taskName = taskName;
    }

    /** The action to add a to-do is conditionally available when the taskName is sufficiently populated. */
    @computed public get addTodoMaybe(): null | ThunkAction {
        return (this._taskName || "").trim().length > 0
            ? () => this._addTodo()
            : null;
    }    

    @action private _addTodo(): void {                        
        this._injected.addIncompleteTodo(this._taskName);
        this._taskName = "";
    }
    
}

export = AddTodo;