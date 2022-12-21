"use strict";
//Class user
class User {
  constructor(firstName, lastName, userName, password, pageSize, category) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.password = password;
    this.pageSize = pageSize;
    this.category = category;
  }
  //Fetch API và hiển thị tin tức
  getNews = async function (page) {
    fetch(
      `https://newsapi.org/v2/top-headlines?country=us&totalResults=20&category=${currentUserArr.category}&pageSize=${currentUserArr.pageSize}&page=${page}&apiKey=19fd353b9d0f45f5bc47a0356552f851`
    )
      .then((response) => response.json())
      .then((data) => {
        //Nội dung tin tức
        for (let i = 0; i < data.articles.length; i++) {
          const html = `<div class="card flex-row flex-wrap">
      <div class="card mb-3" style="">
        <div class="row no-gutters">
          <div class="col-md-4">
            <img src="${data.articles[i].urlToImage}"
              class="card-img"
              alt="${data.articles[i].description}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${data.articles[i].title}</h5>
              <p  class="card-text">${data.articles[i].content}</p>
              <a href="${data.articles[i].url}"
                class="btn btn-primary">View</a>
            </div>
          </div>
        </div>
      </div>
    </div>`;
          //Thêm nội dung vào news.html
          newsContainer.insertAdjacentHTML("beforeend", html);
        }
      });
  };

  //Lưu setting vào current user
  saveSetting = function (pageSize, category) {
    this.pageSize = pageSize;
    this.category = category;
  };
}

//Register elements
const registerBtn = document.getElementById("btn-submit");
const firstNameInput = document.getElementById("input-firstname");
const lastNameInput = document.getElementById("input-lastname");
const userNameInput = document.getElementById("input-username");
const passwordInput = document.getElementById("input-password");
const confirmPasswordInput = document.getElementById("input-password-confirm");

//Local Storage
const currentUserArr =
  parseUser(JSON.parse(getFromStorage("CURRENT_USER_ARRAY"))) || [];
const userArr = JSON.parse(getFromStorage("USER_ARRAY")) || [];

//Chuyển từ object sang instance
function parseUser(userData) {
  if (userData !== null) {
    for (let i = 0; i < userData.length; i++) {
      const user = new User(
        userData[i].firstName,
        userData[i].lastName,
        userData[i].userName,
        userData[i].password,
        userData[i].pageSize,
        userData[i].category
      );
      return user;
    }
  }
}

//Validate data
const validateData = function (data) {
  if (data.firstName === "") {
    alert("Please provide your first name!");
    return false;
  }
  if (data.lastName === "") {
    alert("Please provide your last name!");
    return false;
  }
  if (data.userName === "") {
    alert("Please provide username!");
    return false;
  }
  for (let i; i < userArr.length; i++) {
    if (userArr && data.userName === userArr[i].userName) {
      alert("Username must be unique!");
      return false;
    }
  }
  if (data.password === "") {
    alert("Please provide password!");
    return false;
  } else if (data.password.length < 8) {
    alert("Password need to have 8 or more letters");
    return false;
  }
  if (data.confirmPassword === "") {
    alert("Please provide confirm password!");
    return false;
  } else if (data.password !== data.confirmPassword) {
    alert("Confirm password is not correct!");
    return false;
  }
  return true;
};

//When register
registerBtn.addEventListener("click", function () {
  const data = {
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    userName: userNameInput.value,
    password: passwordInput.value,
    confirmPassword: confirmPasswordInput.value,
  };
  //Check data input
  const validate = validateData(data);
  if (validate) {
    userArr.push(data);
    saveToStorage("USER_ARRAY", JSON.stringify(userArr));
    window.location.href = "../pages/login.html";
  }
});
