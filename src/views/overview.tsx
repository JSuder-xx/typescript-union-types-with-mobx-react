import * as React from 'react';
import { observer } from 'mobx-react';

import { Todo, isPaused, isInProgress } from "../models/todo";
import TodoManager = require("../models/todo_manager");

const fieldAsRow = (label: string, value: string) =>
    (<tr>
        <th>{label}</th>
        <td>{value}</td>
    </tr>);

@observer
class Overview extends React.Component<{ todoManager: TodoManager }> {    
    render() {
        const { totalMinutesLogged, totalPauses, todoLists } = this.props.todoManager;
        return (
            <div>
                <h3>Overview</h3>
                <table>
                    <tbody>
                    {fieldAsRow("Minutes Logged", totalMinutesLogged.toFixed(1))}
                    {fieldAsRow(
                        "# Complete", 
                        todoLists.completed === null ? "" : todoLists.completed.length.toString()
                    )}                
                    {fieldAsRow(
                        "# Incomplete", 
                        todoLists.notCompleted === null ? "" : todoLists.notCompleted.length.toString()
                    )}                
                    {fieldAsRow("# Interruptions", totalPauses.toString())}                
                    </tbody>
                </table>
            </div>
        );    
    }
}

export = Overview;