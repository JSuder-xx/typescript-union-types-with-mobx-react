import * as React from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import TodoManagerViewModel = require("../models/todo_manager");

import TodoList = require("./todo_list");
import AddTodo = require("./add_todo");
import Overview = require("./overview");

@observer
class TodoManager extends React.Component<{todoManager: TodoManagerViewModel}, {}> {
    render() {
        const { todoManager } = this.props;
        return (
            <div>
                <AddTodo addTodo={todoManager.addTodo} />
                <TodoList todoManager={todoManager} />
                <hr />
                <Overview todoManager={todoManager} />
                <DevTools />
            </div>
        );
     }
};

export = TodoManager;