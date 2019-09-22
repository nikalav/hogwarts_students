"use strict";

window.addEventListener("DOMContentLoaded", start);

//describing lists
const allStudents = [];
//to contain expelled student list
const expelledList = [];
const studentList = [];
let showList = studentList.concat(expelledList);
//json links
let studentListLink = "http://petlatkea.dk/2019/hogwartsdata/students.json";
let familyLink = "https://petlatkea.dk/2019/hogwartsdata/families.json";
//for modal
const modal = document.querySelector(".modal");
// let theme = document.querySelector(".modal-theme");
const closeBtn = document.querySelector(".closeBtn");

function start() {
  //add event-listeners for sorting
  document
    .querySelector(".firstNameSort")
    .addEventListener("click", function() {
      sortList(showList, "firstName");
    });
  document.querySelector(".lastNameSort").addEventListener("click", function() {
    sortList(showList, "lastName");
  });
  document.querySelector(".houseSort").addEventListener("click", function() {
    sortList(showList, "house");
  });

  //add event listeners for filter
  document.querySelector(".ravenclaw").addEventListener("click", function() {
    filterStudent("Ravenclaw");
  });
  document.querySelector(".slytherin").addEventListener("click", function() {
    filterStudent("Slytherin");
  });
  document.querySelector(".gryffindor").addEventListener("click", function() {
    filterStudent("Gryffindor");
  });
  document.querySelector(".hufflepuff").addEventListener("click", function() {
    filterStudent("Hufflepuff");
  });
  document.querySelector(".all").addEventListener("click", function() {
    filterStudent("all");
  });
  //modal
  modal.addEventListener("click", () => modal.classList.add("hide"));
  closeBtn.addEventListener("click", () => modal.classList.add("hide"));

  //expel
  document.querySelector("#list tbody").addEventListener("click", clickExpel);
  document.querySelector("#studentExpelled").innerHTML = expelledList.length;

  loadJSON();
}

function loadJSON() {
  fetch(studentListLink)
    .then(response => response.json())
    .then(jsonData => {
      prepareObj(jsonData);
    });
}

function prepareObj(jsonData) {
  jsonData.forEach(jsonObject => {
    //Create new object with cleaned data
    const student = Object.create(Student);

    let trimHouse = jsonObject.house.trim();
    student.house = capitalize(trimHouse);

    //split fullname
    let trimFullName = jsonObject.fullname.trim();
    let splitFullName = trimFullName.split(/[ ,.""-]+/);

    //to show full name in modal
    student.firstName = capitalize(splitFullName[0]);
    if (splitFullName.length === 1) {
      //if there is no last name show spaces
      student.lastName = "";
    } else if (splitFullName.length === 2) {
      student.lastName = capitalize(splitFullName[1]);
    } else if (splitFullName.length === 3) {
      student.middleName = capitalize(splitFullName[1]);
      student.lastName = capitalize(splitFullName[2]);
    }
    // student.lastName = capitalize(splitFullName[splitFullName.length - 1]);

    allStudents.push(student);
    showList.push(student);
    student.id = uuidv4();
    student.expel = "EXPELLED";
    document.querySelector("#studentCount").innerHTML =
      "Student:" + " " + showList.length; //??
    document.querySelector("#studentExpelled").innerHTML =
      "Expelled:" + " " + expelledList.length;
    document.querySelector("#gryffindorCount").innerHTML =
      "Gryffindor:" + " " + countStudentsHouse("Gryffindor");
    document.querySelector("#hufflepuffCount").innerHTML =
      "Hufflepuff:" + " " + countStudentsHouse("Hufflepuff");
    document.querySelector("#ravenclawCount").innerHTML =
      "Ravenclaw:" + " " + countStudentsHouse("Ravenclaw");
    document.querySelector("#slytherinCount").innerHTML =
      "Slytherin:" + " " + countStudentsHouse("Slytherin");
  });

  displayList(allStudents);

  //adding myself in to the list
  const meHack = Object.create(Student);
  meHack.firstName = "Viktorija";
  meHack.lastName = "Lavrinoviciute";
  meHack.house = "Gryffindor";
  meHack.id = "13";
  meHack.prefect = "PROUD PREFECT";

  //push to the list
  allStudents.push(meHack);
  showList.push(meHack);
}
//show student number in each house
function countStudentsHouse(house) {
  return showList.filter(x => x.house === house).length;
}
//arrange the names
function capitalize(str) {
  let cap = str[0].toUpperCase() + str.slice(1).toLowerCase();
  return cap;
}
function filterStudent(house) {
  showList = allStudents.filter(filterByHouse);
  function filterByHouse(student) {
    if (student.house === house || house === "all") {
      return true;
    } else {
      return false;
    }
  }
  displayList(showList);
}
function sortList(list, sortByCriteria) {
  list.sort((a, b) => {
    return a[sortByCriteria].localeCompare(b[sortByCriteria]);
  });
  displayList(list);
}

function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student, index) {
  // create clone
  const clone = document
    .querySelector("template#studentList")
    .content.cloneNode(true);
  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;

  //state the index on the button
  clone.querySelector("[data-action=expel]").dataset.index = index;

  //show expelled
  let expelStudent = expelledList.find(stud => stud.id === student.id);
  if (expelStudent !== undefined) {
    clone.querySelector("[data-field=expeledStatus]").textContent =
      student.expel;
    clone.querySelector("[data-action=expel]").parentElement.remove();
  } else if (expelStudent === undefined) {
    clone.querySelector("[data-action=expel]").dataset.attribute = student.id;
  }

  clone
    .querySelector("[data-action=info]")
    .addEventListener("click", function() {
      showModal(student);
    });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
//Prototype
const Student = {
  firstName: "-firstName-",
  middleName: "-middleName-",
  lastName: "-lastName-",
  house: "-house-",
  expel: "-expelled-",
  id: "-uuid-"
};

//modal
function showModal(student) {
  console.log(student);
  if (student.middleName !== "-middleName-") {
    modal.querySelector("h2").textContent =
      student.firstName + " " + student.middleName + " " + student.lastName;
  } else {
    modal.querySelector("h2").textContent =
      student.firstName + " " + student.lastName;
  }
  // modal.querySelector("h2").textContent =
  //   student.firstName + " " + student.middleName + " " + student.lastName;

  modal.classList.remove("hide");
  // let expelStudent = expelledList.find(stud => stud.id === `${student.id}`);
  //Check if a student is expelled; if it is, show  "EXPELLED"
  let expelStudent = expelledList.find(stud => stud.id === `${student.id}`);
  if (expelStudent !== undefined) {
    modal.querySelector(".signExpel").textContent = `${student.expel}`;
  } else {
    modal.querySelector(".signExpel").textContent = "";
  }

  //adds images acording to the name/id
  if (student.lastName === "Patil") {
    modal.querySelector(
      ".studentImg"
    ).src = `images/${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
  } else {
    modal.querySelector(
      ".studentImg"
    ).src = `images/${student.lastName.toLowerCase()}_${student.firstName[0].toLowerCase()}.png`;
  }
  modal.querySelector(
    ".house_crest"
  ).src = `images/${student.house.toLowerCase()}.png`;
  //Set different styles for each house
  // if (`${student.house}` === "Gryffindor") {
  //   theme.dataset.theme = "Gryffindor";
  // } else if (`${student.house}` === "Hufflepuff") {
  //   theme.dataset.theme = "Hufflepuff";
  // } else if (`${student.house}` === "Ravenclaw") {
  //   theme.dataset.theme = "Ravenclaw";
  // } else if (`${student.house}` === "Slytherin") {
  //   theme.dataset.theme = "Slytherin";
  // }
}

//expel
function clickExpel(event) {
  const element = event.target; //the thing that was actually clicked

  const uuid = element.dataset.attribute;
  let expelStudent = showList.find(student => student.id === uuid);
  console.log(expelStudent);
  if (
    element.dataset.action === "remove" &&
    expelStudent.firstName !== "Viktorija"
  ) {
    element.value = "EXPELLED";
    element.disabled = "true";
    element.classList.add("expelledstyle");

    expelledList.push(expelStudent);
    //get index of element to remove
    const index = element.dataset.index;
    showList.splice(index, 1);
    console.table(showList);

    //
    //show student number

    document.querySelector("#studentCount").innerHTML =
      "Student:" + " " + showList.length; //??
    document.querySelector("#studentExpelled").innerHTML =
      "Expelled:" + " " + expelledList.length;
  } //  else if (expelStudent.firstName === "Viktorija") {
  //   alert("HA HA YOU CAN'T EXPEL ME!");
  // }
  //return uuid;
  function studentId(student) {
    if (student.id === uuid) {
      return true;
    } else {
      return false;
    }
  }
}
//Blood status
loadBloodJSON();

const BloodPrototype = {
  dirtyBlood: "-muggle-",
  halfBlood: "-half-",
  pureBlood: "-pure-"
};

function loadBloodJSON() {
  fetch(familyLink)
    .then(response => response.json())
    .then(jsonData => {
      prepareBloodData(jsonData);
    });
}
function prepareBloodData(jsonData) {
  const familyType = Object.create(BloodPrototype);

  familyType.halfBlood = jsonData.half;
  familytype.pureBlood = jsonData.pure;
  setBloodStatus(familyType);
}
function setBloodStatus(familyType) {
  if (familyType.halfBlood.includes(`${student.lastName}`)) {
    modal.querySelector(".blood").textContent = "Half-wizard/half-muggle";
  } else if (familyType.pureBlood.includes(`${student.lastName}`)) {
    modal.querySelector(".blood").textContent = "Pure-wizard";
  } else {
    modal.querySelector(".blood").textContent = "Muggle";
  }
}
function prepareBloodData(jsonData) {}
// uuid src: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

console.log(uuidv4());
