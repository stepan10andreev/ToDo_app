import { createToDoItem, deleteItem, makeItemReady } from './view.js';

// LOCALSTORAGE
// функция сохранения данных в локальное хранилище
export function saveListInLocalStorage(arroy, listName) {
  localStorage.setItem(listName, JSON.stringify(arroy));
}

// функция получения данных из локульного хранилища (результата массив дел)
export function loadListFromLocalStorage(listName) {
  // задаем переменную
  let arrItemObjects = [];
  // получаем массив дел их локального хранилища
  let dataListName = localStorage.getItem(listName);
  // если данные не пустые, то парсим данные
  if (dataListName !== null) {
    arrItemObjects = JSON.parse(dataListName);
  }
  // возваращаем результат массива, чтобы в дальнейшем получить из этой функции массив, куда будем добавлять дела
  return arrItemObjects;
}

// функция создания элемента дела и добавление его в разметку со связью с localStorage (сохранение/удаление дела)
export function createToDoItemByLocalStorage(todoList, itemObject, arrItemObjects, listName) {
  const todoItemElement = createToDoItem(itemObject);
  todoList.append(todoItemElement.item);

  // используем глобальные функции события клика на "удалить дело" и " изменить статус дела" c сохраненем результата клика в localStorage
  makeItemReady(todoItemElement.doneButton, todoItemElement.item, itemObject, saveListInLocalStorage, arrItemObjects, listName);
  deleteItem(todoItemElement.deleteButton, todoItemElement.item, itemObject, saveListInLocalStorage, arrItemObjects, listName);
}


