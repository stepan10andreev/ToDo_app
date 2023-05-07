import { loadItems, addItemInServer, deleteItemInServer, changeItemInServer, createToDoItemByAPI } from "./useAPI.js";
import { createToDoItem, createAppTitle, createToDoItemform, createToDoList, makeItemReady, deleteItem, getId } from './view.js';

export async function createToDoWithServer(container, title = 'Список дел', owner) {
  let todoAppTitle = createAppTitle(title);
  let todoItemForm = createToDoItemform();
  let todoList = createToDoList();

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  // CЕРВЕР
  // получаем данные с сервера
  let dataItemList = await loadItems(owner)
  // отрисовка на основе данных
  dataItemList.forEach(itemObject => {
    createToDoItemByAPI(todoList, itemObject)
  })

  // браузер создает событие submit на форме по нажатию  на Enter или на кнопку создания дела
  todoItemForm.form.addEventListener('submit', async function(e) {
    e.preventDefault();
    // игнорируем создание элемента, если пользователь ничего не ввел в поле
    if (!todoItemForm.input.value) {
        return;
    }

    // СЕРВЕР
    // постим на сервер обьект дела при добавлении дела
    let itemObject = await addItemInServer(todoItemForm.input.value, owner)

    // добавляем элемент в список
    const todoItemElement = createToDoItem(itemObject);
    todoList.append(todoItemElement.item);
    // глобальные функции "удаления дела" и "изменения состояния дела"
    deleteItem(todoItemElement.deleteButton, todoItemElement.item, itemObject, deleteItemInServer);
    makeItemReady(todoItemElement.doneButton, todoItemElement.item, itemObject, changeItemInServer);

    // очищаем поле для ввода
    todoItemForm.input.value = '';
    // дезактивация кнопки после отправки
    todoItemForm.button.disabled = true;
  });
}
