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
                {list("Working", todoLists.notCompleted)}
                {list("Completed", todoLists.completed)}
            </div>
        );    

        function list(header: string, todos: null | Todo[]) {
            return todos === null
                ? []
                : [
                    <h3>{header}</h3>,
                    <ul>
                        {todos.map(todo =>
                            <TodoItem key={todo.id} todo={todo} todoManager={todoManager} />
                        )}
                    </ul>    
                ];
        }
    }
}

export = TodoList;