import { clickOut } from "../app";
import taskFieldTemplate from "../templates/taskField.html";
import taskFieldTemplateAdmin from "../templates/taskFieldAdmin.html";
import { showBoard } from "./task";
import { eventForm } from "./todo";
import { getOnlineUserFromLS, getFromStorage } from "../utils";

export const setTaskFieldTemplate = function (document, user) {
  // console.log('setTask.. user', user);
  let temp = taskFieldTemplate;
  if (!user) return;
  if (user.role == "role_admin") {
    temp = taskFieldTemplateAdmin;
  }
  document.querySelector("#content").innerHTML = temp;

  document.querySelector(".name-user").innerHTML = `Добро пожаловать, ${
    user.login ? user.login : "Некто"
    }`;
  
  // console.log(JSON.parse(localStorage.getItem("users")));

  showBoard(user);

  function counterTasks() {
    setTimeout(() => {
      const backlog = document.getElementById("backlog");
      const finished = document.getElementById("finished");

      const backlogTasks = backlog.querySelectorAll(".task");
      const finishedTasks = finished.querySelectorAll(".task");

      const activeTasksHTML = document.querySelector(".backlog-length");
      const finishedTasksHTML = document.querySelector(".finished-length");

      activeTasksHTML.innerHTML = "";
      activeTasksHTML.innerHTML = backlogTasks.length;

      finishedTasksHTML.innerHTML = "";
      finishedTasksHTML.innerHTML = finishedTasks.length;
    }, 200);
  }

  counterTasks();

  /* DRAG && DROP */
  const draggables = document.querySelectorAll(".task");
  const droppables = document.querySelectorAll(".swim-lane");

  function updateTask(curTask) {
    let flag = false;
    if (flag) return;
    const zone = curTask.parentNode.getAttribute("id");
    const task_status = zone; // ready
    const task_id = curTask.getAttribute("data-id");

    const currUser = getOnlineUserFromLS();

    const newUserWithTasks = {
      ...currUser,
      tasks: currUser.tasks.map((task) => {
        if (task.task_id === task_id) {
          return {
            ...task,
            task_id: task_id,
            task_status: task_status,
          };
        } else {
          return task;
        }
      }),
    };

    const allDataFromLS = getFromStorage("users");
    allDataFromLS.forEach((user, index) => {
      if (user.id === currUser.id) {
        allDataFromLS[index] = newUserWithTasks;
        localStorage.setItem("users", JSON.stringify(allDataFromLS));
      }
    });

    flag = true;
  }

  draggables.forEach((task) => {
    task.addEventListener("dragstart", () => {
      task.classList.add("is-dragging");
    });
    task.addEventListener("dragend", () => {
      task.classList.remove("is-dragging");

      updateTask(task);
      counterTasks();
    });
  });

  droppables.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();

      const bottomTask = insertAboveTask(zone, e.clientY);
      const curTask = document.querySelector(".is-dragging");

      if (!bottomTask) {
        zone.appendChild(curTask);
      } else {
        zone.insertBefore(curTask, bottomTask);
      }
    });
  });

  const insertAboveTask = (zone, mouseY) => {
    const els = zone.querySelectorAll(".task:not(.is-dragging)");

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task) => {
      const { top } = task.getBoundingClientRect();

      const offset = mouseY - top;

      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closestTask = task;
      }
    });

    return closestTask;
  };
  /* END DRAG && DROP */

  eventForm();

  const formControl = document.querySelectorAll(".form-control");
  const btnIn = document.querySelector("#app-login-btn");
  const btnOut = document.querySelector("#app-out-btn");
  for (let i = 0; i < 2; i++) {
    formControl[i].style.display = "none";
  }
  btnIn.style.display = "none";
  btnOut.style.display = "block";
  btnOut.addEventListener("click", (e) => clickOut());
};
