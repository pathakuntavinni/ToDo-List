/************** SELECT ITEMS **************/
const form = document.querySelector('.todo-form');
const alert = document.querySelector('.alert');
const todo = document.getElementById('todo');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.todo-container');
const list = document.getElementById('todo-list');
const clearBtn = document.querySelector('.clear-btn');

/************** EDIT ITEMS **************/
let editElement;
let editFlag = false;
let editID;

/************** EVENT LISTENERS **************/
form.addEventListener('submit', addItem);

clearBtn.addEventListener('click', clearItems);

window.addEventListener('DOMContentLoaded', setupItems);

/************** FUNCTIONS **************/
function addItem(e) {
  e.preventDefault();
  const value = todo.value;
  const id = new Date().getTime().toString();
  if (value !== '' && !editFlag) {
    const element = document.createElement('article');
    let attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add('todo-item');
    element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
          <button class="edit-btn">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        `;

    // Adding event listeners to edit and delete buttons
    const editBtn = element.querySelector('.edit-btn');
    editBtn.addEventListener('click', editItem);

    const deleteBtn = element.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', deleteItem);

    // Append the new todo element
    list.appendChild(element);

    // Make the container visible
    container.classList.add('show-container');

    //Display Alert
    displayAlert('Item added to the list', 'success');

    // Set back to default
    setBackToDefault();

    // Add to local storage
    addToLocalStorage(id, value);
  }
  else if (value !== '' && editFlag) {
    editElement.textContent = value;
    //Display Alert
    displayAlert('Value changed', 'success');

    // Edit a value in local storage
    editFromLocalStorage(editID, value);

    // Set back to default
    setBackToDefault();
  }
  else {
    displayAlert('Please enter a value', 'danger');
  }
}

function displayAlert(message, action) {
  alert.textContent = message;
  alert.classList.add(`alert-${action}`);

  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);

  }, 1000);
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  list.removeChild(element);

  displayAlert('Item deleted', 'danger');

  removeFromLocalStorage(element.dataset.id);
}

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;

  todo.value = editElement.textContent;
  submitBtn.textContent = 'Edit';
  editFlag = true;
  editID = element.dataset.id;

}

function clearItems() {
  let items = document.querySelectorAll('.todo-item');
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
    container.classList.remove('show-container');

    displayAlert('Items cleared', 'danger');
  }
}

function setBackToDefault() {
  todo.value = '';
  editElement = '';
  editID = '';
  editFlag = false;
  submitBtn.textContent = 'Submit';
}

/************** LOCAL STORAGE **************/
function getLocalStorage() {
  return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

function addToLocalStorage(id, value) {
  const todo = { id, value };
  let items = getLocalStorage();
  items.push(todo);
  localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  console.log(id);
  localStorage.setItem('list', JSON.stringify(items));
}

function editFromLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  console.log(id);
  localStorage.setItem('list', JSON.stringify(items));
}

/************** SETUP ITEMS **************/

function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    })
  }
}

function createListItem(id, value) {
  const element = document.createElement('article');
    let attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add('todo-item');
    element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
          <button class="edit-btn">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        `;

    // Adding event listeners to edit and delete buttons
    const editBtn = element.querySelector('.edit-btn');
    editBtn.addEventListener('click', editItem);

    const deleteBtn = element.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', deleteItem);

    // Append the new todo element
    list.appendChild(element);

    // Make the container visible
    container.classList.add('show-container');
}