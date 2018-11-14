import * as React from 'react';
import * as ReactDOM from 'react-dom';

import TodoManagerViewModel = require("./models/todo_manager");
import TodoManager = require("./views/todo_manager");

const todoManager = new TodoManagerViewModel();
ReactDOM.render(<TodoManager todoManager={todoManager} />, document.getElementById('root'));
