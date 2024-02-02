import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css";
import { User } from "./models/User";
import { generateTestUser, getFromStorage, getOnlineUserFromLS } from "./utils";
import { setTaskFieldTemplate } from "./services/taskFieldTemplate";
import { setNoAccessTemplate } from "./services/noAccessTemplate";
import { State } from "./state";
import { authUser } from "./services/auth";
import { setMenuAsAdmin, setMenuAsUser } from "./services/header";

export const appState = new State();
export const documentHTML = function () {
  return document;
};
const loginForm = document.querySelector("#app-login-form");

/* localStorage.clear(); */

// console.log(JSON.parse(localStorage.getItem("users")));

generateTestUser(User);

function whichUserLoggedIn(currentUser, isLogged) {
  const storageDataAdmin = getFromStorage("users");
  storageDataAdmin.forEach((element, index) => {
    if (element.id === currentUser.id) {
      const storageDataAdminNEW = {
        ...element,
        isOnline: isLogged,
      };
      storageDataAdmin[index] = storageDataAdminNEW;
      localStorage.setItem("users", JSON.stringify(storageDataAdmin));
    }
  });
}

function authTemplate() {
  const user = getOnlineUserFromLS();

  if (!user) return;

  setTaskFieldTemplate(document, user);
  if (user.role == "role_admin") {
    setMenuAsAdmin(document);
  } else {
    setMenuAsUser(document);
  }
}

authTemplate();

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  if (authUser(login, password)) {
    const usersFromLS = getFromStorage("users");
    const currUser = usersFromLS.find((user) => user.login === login);
    setTaskFieldTemplate(document, currUser);
    if (User.isAdmin(appState.currentUser)) {
      setMenuAsAdmin(document);
      whichUserLoggedIn(currUser, true);
    } else {
      setMenuAsUser(document);
      whichUserLoggedIn(currUser, true);
    }
  } else {
    setNoAccessTemplate(document);
  }
  // console.log(JSON.parse(localStorage.getItem("users")));
});

export const clickOut = function (e) {
  const currUser = getOnlineUserFromLS();

  if (currUser) {
    whichUserLoggedIn(currUser, false);
  }

  appState._currentUser = null;
  document.querySelector(".container-board").innerHTML = "";
  document.querySelector(".container-board").innerHTML =
    '<p id="content">Please Sign In to see your tasks!</p>';
  for (let i = 0; i < 2; i++) {
    document.querySelectorAll(".form-control")[i].style.display = "block";
  }
  document.querySelector("#app-login-btn").style.display = "block";
  document.querySelector("#app-out-btn").style.display = "none";
};
