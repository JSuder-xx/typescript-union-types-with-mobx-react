import * as React from 'react';
import { observer } from 'mobx-react';

import TodoManager = require("../models/todo_manager");

const fieldAsRow = (label: string, value: string) =>
    <tr>
        <th>{label}</th>
        <td>{value}</td>
    </tr>;

const arrayCountString = (items: null | any[]) =>
    items === null ? "" : items.length.toString();

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
                    {fieldAsRow("# Complete", arrayCountString(todoLists.completed))}                
                    {fieldAsRow("# Incomplete", arrayCountString(todoLists.notCompleted))}                
                    {fieldAsRow("# Interruptions", totalPauses.toString())}                
                    </tbody>
                </table>
            </div>
        );    
    }
}

export = Overview;