import { BaseModel } from "./BaseModel";
import {
  getFromStorage,
  addToStorage,
  deleteInStorage,
  replaceToStorage,
} from "../utils";
import { appState } from "../app";
import { Status } from "./support";
import { User } from "./User";

export class Task extends BaseModel {
  constructor(description) {
    super();
    this.description = description;
    this.status = Status.BACKLOG;
    this.idUser = appState.currentUser == null ? -1 : appState.currentUser.id;
    this.loginUser =
      appState.currentUser == null ? "" : appState.currentUser.login;
    this.storageKey = "task";
  }

  static getListTask() {
    let user = appState.currentUser;
    let tasks = getFromStorage("task");
    if (User.isAdmin(user)) {
      return tasks;
    } else {
      let listTask = [];
      for (let task of tasks) {
        if (user.id == task.idUser) {
          listTask.push(task);
        }
      }
      return listTask;
    }
  }

  static getTaskById(id) {
    let task = null;
    for (const t of this.getListTask()) {
      if (t.id == id) {
        task = t;
      }
    }
    return task;
  }

  static save(task) {
    try {
      addToStorage(task, task.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  static changeStatus(id, status) {
    try {
      let task = Task.getTaskById(id);
      deleteInStorage(task, task.storageKey);
      task.status = status;
      addToStorage(task, task.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  static changeDescription(id, description) {
    try {
      let task = Task.getTaskById(id);
      task.description = description;
      replaceToStorage(task, task.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  static deleteTask(id) {
    try {
      let task = Task.getTaskById(id);
      deleteInStorage(task, task.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  static getListTaskForBackLog() {
    let listTask = [];
    for (let task of Task.getListTask()) {
      if (task.status == Status.BACKLOG) {
        listTask.push(task);
      }
    }
    return listTask;
  }

  static getBackLogSize() {
    return Task.getListTaskForBackLog().length;
  }

  static getListTaskForReady() {
    let listTask = [];
    for (let task of Task.getListTask()) {
      if (task.status == Status.READY) {
        listTask.push(task);
      }
    }
    return listTask;
  }

  static getListTaskForProgress() {
    let listTask = [];
    for (let task of Task.getListTask()) {
      if (task.status == Status.IN_PROGRESS) {
        listTask.push(task);
      }
    }
    return listTask;
  }

  static getListTaskForFinished() {
    let listTask = [];
    for (let task of Task.getListTask()) {
      if (task.status == Status.FINISHED) {
        listTask.push(task);
      }
    }
    return listTask;
  }
  static getFinishedSize() {
    return Task.getListTaskForFinished().length;
  }
}
