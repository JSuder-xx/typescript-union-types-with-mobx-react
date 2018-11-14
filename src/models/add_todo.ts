import { observable, action, computed } from 'mobx';

/**
 * Represents the user interaction when adding a To-Do.
 */
class AddTodo {

    @observable
    private _taskName = "";

    constructor(private _injected: { 
        addIncompleteTodo: (taskName: string) => void;
    }) {}

    public get taskName() { return this._taskName; }

    @action
    public updateTaskName(taskName: string) {
        this._taskName = taskName;
    }

    /**
     * The action to add a to-do is conditionally available based on the state of the task.
     */
    @computed
    public get addTodoMaybe() {
        return (this._taskName || "").trim().length > 0
            ? () => this._addTodo()
            : null;
    }    

    @action
    private _addTodo() {                        
        this._injected.addIncompleteTodo(this._taskName);
        this._taskName = "";
    }
    
}

export = AddTodo;