import { BaseModel } from "./BaseModel";
import { Role } from "./support";
import { getFromStorage, addToStorage, deleteInStorage } from "../utils";

export class User extends BaseModel {
  constructor(login, password, role) {
    super();
    this.login = login;
    this.password = password;
    this.role = role;
    this.storageKey = "users";
    this.isOnline = false;
    this.tasks = [];
  }
  get hasAccess() {
    let users = getFromStorage(this.storageKey);
    console.log("user из класса", users);
    if (users.length == 0) return false;
    for (let user of users) {
      if (user.login == this.login && user.password == this.password) {
        this.id = user.id;
        this.role = user.role;
        return true;
      }
    }
    return false;
  }

  static isAdmin(user) {
    if (user.role == Role.R_ADMIN) {
      return true;
    } else {
      return false;
    }
  }

  static save(user) {
    try {
      addToStorage(user, user.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  static delete(id) {
    try {
      let user = User.getById(id);
      console.log(user);
      deleteInStorage(user, user.storageKey);
    } catch (e) {
      throw new Error(e);
    }
  }

  static getById(id) {
    let user = null;
    for (const u of this.getListUserFromLocalStorage()) {
      if (u.id == id) {
        user = u;
      }
    }
    return user;
  }

  static isHasThisUser(user) {
    for (const u of this.getListUserFromLocalStorage()) {
      if (u.login == user.login) {
        return true;
      }
    }
    return false;
  }

  static getListUserFromLocalStorage() {
    return getFromStorage("users");
  }
}
