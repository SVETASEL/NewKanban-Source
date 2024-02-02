import { appState } from "../app";
// import { Task } from "../models/Task";
// import { Status } from "../models/support";
import { User } from "../models/User";
// import { getFromStorage, getOnlineUserFromLS } from "../utils";

export const showBoard = (user) => {
  // console.log('В TASK.JS', JSON.parse(localStorage.getItem('users')))

  // const user = getOnlineUserFromLS();
  // { "id":"51794061-39bb-448f-92d4-5b6d7aefad35","login":"user123","password":"123","role":"user","storageKey":"user", tasks: [{task_title: '', task_id: '', task_status: 'backlog' }, {task_title: '', task_id: '', task_status: 'ready' }], isOnline: true};

  if (!user) return;
  // [{task_title: '', task_id: '', task_status: 'backlog' }, {task_title: '', task_id: '', task_status: 'ready' }];

  const tasks = user.tasks;

  if (tasks) {
    tasks.map((task) => {
      let container = document.getElementById(`${task.task_status}`);
      container.insertAdjacentHTML(
        "beforeend",
        `<p class="task" draggable="true" data-id="${task.task_id}" data-zone="${task.task_status}">${task.task_title}</p>`
      );
    });
  }
};

function isAdmin() {
  return User.isAdmin(appState.currentUser);
}
