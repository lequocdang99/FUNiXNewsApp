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

//Button
const loginBtn = document.getElementById("btn-submit");

//Input
const userNameInput = document.getElementById("input-username");
const passwordInput = document.getElementById("input-password");

//Local Storage
const currentUserArr =
  parseUser(JSON.parse(getFromStorage("CURRENT_USER_ARRAY"))) || [];
const userArr = JSON.parse(getFromStorage("USER_ARRAY")) || [];

//Chuyển từ object sang instance
function parseUser(userData) {
  if (userData !== null) {
    const user = new User(
      userData.firstName,
      userData.lastName,
      userData.userName,
      userData.password,
      userData.pageSize,
      userData.category
    );
    return user;
  }
}

//Validate data
const validateData = function (data) {
  if (data.userName === "") {
    alert("Please provide username!");
    return false;
  }
  for (let i; i < userArr.length; i++) {
    if (data.userName !== userArr[i].userName) {
      alert("Wrong username! Please try again.");
      return false;
    }
  }
  if (data.password === "") {
    alert("Please provide password!");
    return false;
  } else if (data.password < 8) {
    alert("Password must have 8 or more characters!");
  } else if (
    data.password !==
    userArr.filter((array) => array.userName === data.userName)[0].password
  ) {
    alert("Wrong password! Please try again.");
    return false;
  }
  return true;
};

//Press login button
loginBtn.addEventListener("click", function () {
  const loginData = {
    userName: userNameInput.value,
    password: passwordInput.value,
  };
  const validate = validateData(loginData);
  if (validate) {
    saveToStorage(
      "CURRENT_USER_ARRAY",
      JSON.stringify(
        userArr.filter((array) => array.userName === loginData.userName)
      )
    );
    window.location.href = "../index.html";
  }
});
