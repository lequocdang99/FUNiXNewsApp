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
  getNews = async function (category, pageSize, page) {
    fetch(
      `https://newsapi.org/v2/top-headlines?country=us&totalResults=20&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=19fd353b9d0f45f5bc47a0356552f851`
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
    return this;
  };
}

//Class task
class Task {
  constructor(task, owner, isDone) {
    this.task = task;
    this.owner = owner;
    this.isDone = isDone;
  }
}

//Local Storage
const currentUserArr =
  parseUser(JSON.parse(getFromStorage("CURRENT_USER_ARRAY"))) || [];
const userArr = JSON.parse(getFromStorage("USER_ARRAY")) || [];
const toDoArr = JSON.parse(getFromStorage("TASK_ARRAY")) || [];

//Setting Input
const pageSizeInput = document.getElementById("input-page-size");
const categoryInput = document.getElementById("input-category");
const submitBtn = document.getElementById("btn-submit");

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

//Nhận setting input mới
submitBtn.addEventListener("click", function () {
  //Save setting vào userArr
  const data = [
    currentUserArr.saveSetting(pageSizeInput.value, categoryInput.value),
  ];
  //Save user array vào local storage
  saveToStorage("CURRENT_USER_ARRAY", JSON.stringify(data));
  // //Chuyển về trang news
  window.location.href = "./news.html";
});
