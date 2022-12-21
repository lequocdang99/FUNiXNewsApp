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

//Class task
class Task {
  constructor(task, owner, isDone) {
    this.task = task;
    this.owner = owner;
    this.isDone = isDone;
  }
}

//Todo elements
const taskInput = document.getElementById("input-task");
const toDoList = document.getElementById("todo-list");

//Button
const addTaskBtn = document.getElementById("btn-add");
const deleteTaskBtn = document.querySelectorAll(".close");

//Local Storage
const currentUserArr =
  parseUser(JSON.parse(getFromStorage("CURRENT_USER_ARRAY"))) || [];

const userArr = JSON.parse(getFromStorage("USER_ARRAY")) || [];
const toDoArr = JSON.parse(getFromStorage("TASK_ARRAY")) || [];

//Chuyển từ object sang instance
function parseUser(userData) {
  if (userData !== null) {
    for (let i = 0; i < userData.length; i++) {
      const user = new User(
        userData[i].firstName,
        userData[i].lastName,
        userData[i].userName,
        userData[i].password
      );
      return user;
    }
  }
}

//Render to-do list
const renderTaskTable = function (data) {
  for (let i = 0; i < data.length; i++) {
    //Đã done
    if (data[i].isDone === true) {
      const html = `<li class="checked" id="${i}">${data[i].task}<span class="close" id="${i}">×</span></li>`;
      toDoList.insertAdjacentHTML("beforeend", html);
    }
    //Chưa done
    else if (data[i].isDone === false) {
      const html = `<li id="${i}">${data[i].task}<span class="close" id="${i}">×</span></li>`;
      toDoList.insertAdjacentHTML("beforeend", html);
    }
  }
};
//Hiển thị to do list theo current user khi mới vào trang
renderTaskTable(
  toDoArr.filter((array) => array.owner.userName === currentUserArr.userName)
);

//Nhập task mới
addTaskBtn.addEventListener("click", function () {
  if (taskInput.value) {
    const taskData = {
      task: taskInput.value,
      owner: currentUserArr,
      isDone: false,
    };
    toDoArr.push(taskData);
    //Lưu to do list vào local storage
    saveToStorage("TASK_ARRAY", JSON.stringify(toDoArr));
    //Xóa to do list cũ
    toDoList.innerHTML = "";
    //Clear input
    taskInput.value = "";
    //Hiển thị to do list theo current user
    renderTaskTable(
      toDoArr.filter(
        (array) => array.owner.userName === currentUserArr.userName
      )
    );
  }
});

//Check task đã làm xong
const toggleTask = function (index) {
  if (toDoArr[index]) {
    toDoArr[index].isDone === false
      ? (toDoArr[index].isDone = true)
      : (toDoArr[index].isDone = false);
    saveToStorage("TASK_ARRAY", JSON.stringify(toDoArr));
    toDoList.innerHTML = "";
    renderTaskTable(
      toDoArr.filter(
        (array) => array.owner.userName === currentUserArr.userName
      )
    );
  }
};

//Xoá task
const deleteTask = function (index) {
  //Delete data from petArr
  toDoArr.splice(index, 1);
  //Update petArr in local storage
  saveToStorage("TASK_ARRAY", JSON.stringify(toDoArr));
  //Xóa to do list cũ
  toDoList.innerHTML = "";
  //Display pet table
  renderTaskTable(
    toDoArr.filter((array) => array.owner.userName === currentUserArr.userName)
  );
};

//Listen click event for delete and toggel task
toDoList.addEventListener("click", function (e) {
  if (!e.target.classList.contains("close")) {
    toggleTask(e.target.id);
  } else if (e.target.classList.contains("close")) {
    deleteTask(e.target.id);
  }
});
