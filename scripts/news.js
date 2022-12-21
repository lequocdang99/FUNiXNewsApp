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
  };
}

//DOM articles
const newsContainer = document.getElementById("news-container");

//Button
const prevBtn = document.getElementById("btn-prev");
const nextBtn = document.getElementById("btn-next");

//Page number
const pageNum = document.getElementById("page-num");
let page = 1;

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

//Tin tức trang 1
if (!currentUserArr.category) {
  currentUserArr.getNews("general", 5, 1);
} else {
  currentUserArr.getNews(currentUserArr.category, currentUserArr.pageSize, 1);
}
prevBtn.style.display = "none";

//Next trang
nextBtn.addEventListener("click", function () {
  //Hiện nút previous
  prevBtn.style.display = "initial";
  //Reset nội dung news
  newsContainer.innerHTML = "";
  //Current user chưa nhập setting
  if (currentUserArr.category === undefined) {
    if (page < 4) {
      currentUserArr.getNews("general", 5, page + 1);
      //Hiển thị số trang
      pageNum.innerHTML = `${page + 1}`;
      page = page + 1;
    }
    if (page === 4) {
      nextBtn.style.display = "none";
    }
  }
  //Current user đã nhập setting
  else {
    if (page < Math.floor(20 / currentUserArr.pageSize)) {
      currentUserArr.getNews(
        currentUserArr.category,
        currentUserArr.pageSize,
        page + 1
      );
      //Hiển thị số trang
      pageNum.innerHTML = `${page + 1}`;
      page = page + 1;
    }
    if (page === Math.floor(20 / currentUserArr.pageSize)) {
      nextBtn.style.display = "none";
    }
  }
});

//Previous trang
prevBtn.addEventListener("click", function () {
  //Hiện nút next
  nextBtn.style.display = "initial";
  //Reset nội dung news
  newsContainer.innerHTML = "";
  //Current user chưa nhập setting
  if (currentUserArr.category === undefined) {
    if (page > 1) {
      currentUserArr.getNews("general", 5, page - 1);
      //Hiển thị số trang
      pageNum.innerHTML = `${page - 1}`;
      page = page - 1;
    }
    if (page === 1) {
      prevBtn.style.display = "none";
    }
  }
  //Current user đã nhập setting
  else {
    if (page > 1) {
      currentUserArr.getNews(
        currentUserArr.category,
        currentUserArr.pageSize,
        page - 1
      );
      //Hiển thị số trang
      pageNum.innerHTML = `${page - 1}`;
      page = page - 1;
    }
    if (page === 1) {
      prevBtn.style.display = "none";
    }
  }
});
