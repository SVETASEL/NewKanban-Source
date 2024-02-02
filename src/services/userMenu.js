import { documentHTML, clickOut } from "../app";

export const userButtonMenu = function () {
  const menuBtn = documentHTML().querySelector(".button-menu");
  const menudisplay = documentHTML().querySelector(".menu");
  menuBtn.addEventListener("click", function (e) {
    if (menuBtn.style.transform == "rotate(180deg)") {
      menuBtn.style.transform = "rotate(0deg)";
      menudisplay.style.display = "none";
    } else {
      menuBtn.style.transform = "rotate(180deg)";
      menudisplay.style.display = "block";
    }
  });
};

export const userLogOutMenu = function () {
  const logoutBtn2 = documentHTML().querySelector(".list-menu-logout");
  logoutBtn2.addEventListener("click", (e) => clickOut());
};
