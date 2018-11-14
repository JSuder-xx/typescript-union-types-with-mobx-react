import * as React from 'react';
import { observer } from 'mobx-react';

import { Todo, isPaused, isNeverStarted, isInProgress } from "../models/todo";
import TodoManager = require("../models/todo_manager");

@observer
class TodoItem extends React.Component<{ todoManager: TodoManager, todo: Todo }> {
    render() {
        const { todo, todoManager } = this.props;
        const { startMaybe } = todoManager;
        return (
            <li>
                {todo.taskName}
                {
                    isInProgress(todo)
                    && <a className="action" onClick={() => todoManager.complete(todo)}>Complete</a>
                }
                {
                    (isPaused(todo) || isNeverStarted(todo))
                    && startMaybe !== null
                    && <a className="action" onClick={() => startMaybe(todo)}>
                        {isPaused(todo) ? "Resume" : "Start"}
                    </a>
                }
                {
                    isInProgress(todo)
                    && <a className="action" onClick={() => todoManager.pause(todo)} >Pause</a>
                }
            </li>
        );
    }
}

export = TodoItem;