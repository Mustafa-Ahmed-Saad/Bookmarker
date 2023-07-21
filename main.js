// ---------------------------------------------------------------- variables
var siteNameInput = document.getElementById("site-name");
var siteURLInput = document.getElementById("site-url");
var submitBtn = document.getElementById("submit");
var tHead = document.getElementById("thead");
var tBody = document.getElementById("tbody");
var searchInput = document.getElementById("searchInput");
var showModuleBtn = document.getElementById("showModuleBtn");
var modalBody = document.getElementById("modal-body");
var sites = [];
var trs = "";
var IndexUpdate = -1;

checkProductInLocalStorage();

// ---------------------------------------------------------------- functions
function checkProductInLocalStorage() {
  let localStorageSites = getFromLocalStorage("sites");
  if (localStorageSites != null && localStorageSites.length > 0) {
    sites = localStorageSites;
  }
  display();
}

function checkBtnText() {
  if (submitBtn.innerText === "Submit") {
    addBookmark();
  } else {
    updateSite();
  }
}

function isUrlValid(url = siteURLInput.value) {
  var regex =
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
  var valid = regex.test(url);

  if (valid) {
    removeClass(siteURLInput, "is-invalid");
    addClass(siteURLInput, "is-valid");
  } else {
    removeClass(siteURLInput, "is-valid");
    addClass(siteURLInput, "is-invalid");
  }

  return valid;
}
function isNameValid(url = siteNameInput.value) {
  var regex = /^.{3,30}$/;

  var valid = regex.test(url);

  if (valid) {
    removeClass(siteNameInput, "is-invalid");
    addClass(siteNameInput, "is-valid");
  } else {
    removeClass(siteNameInput, "is-valid");
    addClass(siteNameInput, "is-invalid");
  }

  return valid;
}

function isSiteExist(siteName, siteUrl) {
  var valid = false;
  for (var i = 0; i < sites.length; i++) {
    if (siteName === sites[i].name || siteUrl === sites[i].url) {
      valid = true;
      break;
    }
  }
  return valid;
}

function addBookmark() {
  var site = {
    name: siteNameInput.value,
    url: siteURLInput.value,
  };

  if (isNameValid(siteNameInput.value) && isUrlValid(siteURLInput.value)) {
    if (isSiteExist(siteNameInput.value, siteURLInput.value)) {
      showModal(
        `<p>you can't add this book mark because Site name or site url is exist</p>`
      );
    } else {
      sites.push(site);
      saveChange("sites", sites);
      clearInputs();
    }
  } else {
    showModal(
      `<h5>Site Name or Url is not valid, Please follow the rules below:</h5>
          <p><i class="fa-regular fa-circle-right text-danger"></i> Site name must contain at least 3 charactersSite</p>
          <p><i class="fa-regular fa-circle-right text-danger"></i> site URL must be a valid one</p>`
    );
  }
}

function display() {
  if (sites.length <= 0) {
    addClass(tHead);
    trs = "<p>no bookmark please add some bookmarks</p>";
  } else {
    removeClass(tHead);
    trs = "";
    for (var i = 0; i < sites.length; i++) {
      trs += createTr(i, sites[i].name, sites[i].url);
    }
  }

  tBody.innerHTML = trs;
}

function deleteSite(index) {
  sites.splice(index, 1);
  saveChange("sites", sites);

  clearInputs();
  submitBtn.innerText = "Submit";
}

function visitSite(index) {
  console.log(typeof sites[index].url);
  window.open(sites[index].url, "_blank");
}

function updateSite() {
  if (
    IndexUpdate > -1 &&
    isNameValid(siteNameInput.value) &&
    isUrlValid(siteURLInput.value)
  ) {
    var siteAfterEdit = {
      name: siteNameInput.value,
      url: siteURLInput.value,
    };

    sites.splice(IndexUpdate, 1, siteAfterEdit);

    saveChange("sites", sites);
    submitBtn.innerText = "Submit";

    clearInputs();
  } else {
    showModal(
      `<h5>can't update bookmark because Site Name or Url is not valid, Please follow the rules below:</h5>
          <p><i class="fa-regular fa-circle-right"></i> Site name must contain at least 3 charactersSite</p>
          <p><i class="fa-regular fa-circle-right"></i> site URL must be a valid one</p>`
    );
  }
}

function saveChange(key, value) {
  saveInLocalStorage(key, value);
  display();
}

function patchInputs(index) {
  let obj = sites[index];
  IndexUpdate = index;

  siteNameInput.value = obj.name;
  siteURLInput.value = obj.url;

  submitBtn.innerText = "Update";
}

function createTr(index, siteName, siteUrl) {
  var tr = `
        <tr>
          <td>${index + 1}</td>
          <td class="hide-overflow-text">${siteName}</td>
          <td class="hide-overflow-text">${siteUrl}</td>
          <td>
            <button type="button" onclick="patchInputs(${index})" class="btn btn-warning text-white">
              <i class="fa-solid fa-pen"></i>
              Update
            </button>
          </td>
          <td>
            <button class="btn btn-visit" onclick="visitSite(${index})" data-index="0">
              <i class="fa-solid fa-eye pe-2"></i>
              Visit
            </button>
          </td>
          <td>
            <button class="btn btn-delete pe-2" onclick="deleteSite(${index})" data-index="0">
              <i class="fa-solid fa-trash-can"></i>
              Delete
            </button>
          </td>
        </tr>`;

  return tr;
}

function search() {
  let ui = "";

  for (let i = 0; i < sites.length; i++) {
    if (
      (sites[i].name + sites[i].url)
        .toLowerCase()
        .includes(searchInput.value.toLowerCase())
    ) {
      ui += createTr(i, sites[i].name, sites[i].url);
    }
  }

  if (ui.length <= 0) {
    addClass(tHead);
    ui = "<p class='text-center'>no bookmark match</p>";
  } else {
    removeClass(tHead);
  }

  tBody.innerHTML = ui;
}

function clearInputs() {
  siteNameInput.value = "";
  siteURLInput.value = "";
}

function saveInLocalStorage(key, value) {
  // convert value to string to store this value in local storage
  value = JSON.stringify(value);
  localStorage.setItem(key, value);
}

function getFromLocalStorage(key) {
  let value = localStorage.getItem(key);
  // convert string that came from local storage to its type
  return JSON.parse(value);
}

function addClass(el, className = "d-none") {
  if (!el.classList.contains(className)) {
    el.classList.add(className);
  }
}

function removeClass(el, className = "d-none") {
  if (el.classList.contains(className)) {
    el.classList.remove(className);
  }
}

function showModal(ui) {
  modalBody.innerHTML = ui;
  showModuleBtn.click();
}
