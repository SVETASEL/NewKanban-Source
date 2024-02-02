import { getFromStorage, addToStorage } from "../utils";

export default function handleRegForm() {
  const loginFormReg = document.querySelector("#app-login-form-reg");
  if (loginFormReg) {
    loginFormReg.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(loginFormReg);
      const login = formData.get("login");
      const password = formData.get("password");
      let role = "user";
      
      const storageDataUser = getFromStorage("user");
      console.log(storageDataUser);

      const storageDataAdmin = getFromStorage("admin");

      if (storageDataAdmin.length === 0) {
        if (storageDataAdmin[0].login !== login) {
          role = "admin";
          const newUser = new User(login, password, role);
          console.log("newUser", newUser);
          User.save(newUser);

          console.log("после отправки формы", localStorage.getItem("admin"));
        } else {
          const storageDataUser = getFromStorage("user");
          let hasUser = false;
          hasUser = storageDataUser.some((user) => user.login == login);
          console.log(hasUser);
          if (!hasUser) {
            const newUser = new User(login, password, role);
            User.save(newUser);
          } else {
            alert("Такой пользователь уже существует " + login);
          }
        }
      }

      /* 
              TODO
              1) из localStorage получить админа, и если его там нет, тогда текущий юзер становится админом authUser(login, password, 'admin') и id пользователя
              2) если админ уже есть, то любой другой пользователь это user authUser(login, password, 'user') и id пользователя
              3) если регистрацию завершил админ, его надо перекинуть на странице приветствия "Привет, админ" и 
            */

      // let fieldHTMLContent = authUser(login, password)
      //   ? taskFieldTemplate
      //   : noAccessTemplate;

      // document.querySelector("#content").innerHTML = fieldHTMLContent;
    });
  }
}

/* for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  console.log(`${key}: ${localStorage.getItem(key)}`);
}
const storageDataAdmin1 = getFromStorage("admin");
const storageDataLogin1 = getFromStorage("admin");
console.log("по ключу admin", storageDataAdmin1);
console.log("по ключу login", storageDataLogin1[0].login); */
