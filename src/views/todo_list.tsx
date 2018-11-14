import * as React from 'react';
import { observer } from 'mobx-react';

import { Todo } from "../models/todo";
import TodoManager = require("../models/todo_manager");
import TodoItem = require("./todo_item");

@observer
class TodoList extends React.Component<{ todoManager: TodoManager }> {    
    render() {
        const { todoManager } = this.props; 
        const { todoLists } = todoManager;       
        return (
            <div>
                {
                    (todoLists.notCompleted === null)
                    ? []
                    : [
                        <h3>Working</h3>,
                        list(todoLists.notCompleted)       
                    ]
                }
                {
                    (todoLists.completed === null)
                    ? []
                    : [
                        <h3>Completed</h3>,
                        list(todoLists.completed)       
                    ]
                }
            </div>
        );    

        function list(todos: Todo[]) {
            return todos.length === 0
                ? <em>None</em>
                : <ul>
                    {todos.map(todo =>
                        <TodoItem key={todo.id} todo={todo} todoManager={todoManager} />
                    )}
                </ul>;
        }
    }
}

export = TodoList;