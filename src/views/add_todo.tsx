import * as React from 'react';
import { observer } from 'mobx-react';
import AddTodoViewModel = require("../models/add_todo");
import { executeOnKeyCodes } from "../api/views/events";

@observer
class AddTodo extends React.Component<{addTodo: AddTodoViewModel}, {}> {
    render() {
        const { addTodo } = this.props;
        const { addTodoMaybe } = addTodo;
        return (
            <div>
                <label>Task </label>
                <input
                    onChange={(evt) => addTodo.updateTaskName(evt.target.value)}
                    value={addTodo.taskName}
                    onKeyDown={addTodoMaybe === null ? undefined : executeOnKeyCodes([13], addTodoMaybe)} />
                {
                    (addTodoMaybe === null)
                        ? <button disabled={true}>Add</button>
                        : <button onClick={addTodoMaybe}>Add</button>
                }
            </div>
        );    
    }
}

export = AddTodo;