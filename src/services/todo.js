import { getOnlineUserFromLS, getFromStorage } from "../utils";
import { BaseModel } from "../models/BaseModel";

export const eventForm = () => {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const submit = document.querySelector(".button-add-backlog");
  const todoLane = document.getElementById("backlog");

  input?.addEventListener("input", () => {
    const text = input.value;
    let textSubmit = "+ Add card";
    if (text) textSubmit = "Submit";
    submit.innerHTML = "";
    submit.innerHTML = textSubmit;
  });

  function addTaskToLS(task) {
    const currUser = getOnlineUserFromLS();
    if (!currUser) return;
    let tasks = currUser.tasks;

    const newUserWithTasks = {
      ...currUser,
      tasks: [...tasks, task],
    };

    const allDataFromLS = getFromStorage("users");
    allDataFromLS.forEach((user, index) => {
      if (user.id === currUser.id) {
        allDataFromLS[index] = newUserWithTasks;
        localStorage.setItem("users", JSON.stringify(allDataFromLS));
      }
    });
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value;

    if (!value) return;

    let new_task_id = new BaseModel().getID;

    const task = {
      task_id: new_task_id,
      task_title: value,
      task_status: "backlog",
    };

    addTaskToLS(task);

    const newTask = document.createElement("p");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.innerText = value;

    newTask.addEventListener("dragstart", () => {
      newTask.classList.add("is-dragging");
    });

    newTask.addEventListener("dragend", () => {
      newTask.classList.remove("is-dragging");
    });

    todoLane.appendChild(newTask);

    input.value = "";
    submit.innerHTML = "";
    submit.innerHTML = "+ Add card";

    console.log(
      "после отправки формы",
      JSON.parse(localStorage.getItem("users"))
    );
  });
};
