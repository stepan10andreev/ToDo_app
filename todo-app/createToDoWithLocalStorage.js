import { saveListInLocalStorage, loadListFromLocalStorage, createToDoItemByLocalStorage } from './useLocalStorage.js';
import { createToDoItem, createAppTitle, createToDoItemform, createToDoList, makeItemReady, deleteItem, getId } from './view.js';

// функция приложения, использующая локальное хранилище
export function createToDoWithLocalStorage(container, title = 'Список дел', listName) {
  let todoAppTitle = createAppTitle(title);
  let todoItemForm = createToDoItemform();
  let todoList = createToDoList();

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  // LOCALSTORAGE
  // получаем массив дел из данных локального хранилища (внутри этой функции все действия, если данные пустые)
  let arrItemObjects = loadListFromLocalStorage(listName)
  for (let itemObject of arrItemObjects) {
    createToDoItemByLocalStorage(todoList, itemObject, arrItemObjects, listName)
  }
  // событие submit на форме
  todoItemForm.form.addEventListener('submit', async function(e) {
    e.preventDefault();
    // игнорируем создание элемента, если пользователь ничего не ввел в поле
    if (!todoItemForm.input.value) {
        return;
    }
    // создаем обьект при создании ДОМ-элемента (при событии submit)
    let itemObject = {
        id: getId(arrItemObjects),
        name: todoItemForm.input.value,
        done: false,
    };
    // строим ДОМ элемент дела на основе созданного обьекта
    let todoItem = createToDoItem(itemObject);
    // добавляем дело в виде обьекта в массив
    arrItemObjects.push(itemObject);

    // LOCALSTORAGE
    // функция сохранения нового массива дел после создания нового дела в локальное хранилище
    saveListInLocalStorage(arrItemObjects, listName);

    // добавляем элемент в список
    todoList.append(todoItem.item);
    // глобальные функции "удаления дела" и "изменения состояния дела"
    makeItemReady(todoItem.doneButton, todoItem.item, itemObject, saveListInLocalStorage, arrItemObjects, listName);
    deleteItem(todoItem.deleteButton, todoItem.item, itemObject, saveListInLocalStorage, arrItemObjects, listName);
    // очищаем поле для ввода
    todoItemForm.input.value = '';
    // дезактивация кнопки после отправки
    todoItemForm.button.disabled = true;
  });
}
