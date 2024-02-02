import menuForAdmin from "../templates/menuForAdmin.html";
import menuForUser from "../templates/menuForUser.html";
import { userButtonMenu, userLogOutMenu } from "./userMenu";
import { User } from "../models/User";
import { setTaskFieldTemplate } from "./taskFieldTemplate";
import { Role } from "../models/support";

export const setMenuAsAdmin = function (document) {
  document.querySelector(".menu").innerHTML = menuForAdmin;
  for (const user of User.getListUserFromLocalStorage()) {
    document.querySelector(".delete-id-user").innerHTML +=
      '<li class="user-delete button-deleteUser" id="' +
      user.id +
      '">' +
      user.login +
      "</li>";
  }
  userButtonMenu();
  userLogOutMenu();
  document.querySelectorAll(".button-deleteUser").forEach((element) => {
    element.addEventListener("click", function () {
      User.delete(element.id, element.textContent);
      update(document);
    });
  });

  document.querySelector(".button-add").addEventListener("click", function () {
    document.querySelector(".modal").style.display = "block";
  });

  document.querySelector(".btn-primary").addEventListener("click", function () {
    const newInputLogin = document.querySelector(".newLogin");
    const newInputPassword = document.querySelector(".newPassword");
    if (newInputLogin.value == "" || newInputPassword.value == "") {
      const textWrong = document.querySelector(".text-wrong");
      textWrong.style.display = "block";
    } else {
      const userNew = new User(
        newInputLogin.value,
        newInputPassword.value,
        Role.R_USER
      );
      User.save(userNew);
      document.querySelector(".modal").style.display = "none";
      update(document);
    }
  });

  document
    .querySelector(".btn-secondary")
    .addEventListener("click", function () {
      update(document);
    });

  document.querySelector(".close").addEventListener("click", function () {
    update(document);
  });
};

function update(document) {
  setTaskFieldTemplate(document);
  setMenuAsAdmin(document);
}

export const setMenuAsUser = function (document) {
  document.querySelector(".menu").innerHTML = menuForUser;
  userButtonMenu();
  userLogOutMenu();
};
