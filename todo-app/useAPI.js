import { createToDoItem, deleteItem, makeItemReady } from './view.js';

// РАБОТА с СЕРВЕРОМ
// получение данных с сервера
export async function loadItems(owner) {
  const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
  const data = await response.json();
  return data;
}

// добавление дела в данные на сервере
export async function addItemInServer(name, owner) {
  const response = await fetch('http://localhost:3000/api/todos', {
    method: 'POST',
    body: JSON.stringify({
      name,
      owner,
    }),
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const data = await response.json();
  return data;
}

// удаление данных с сервера
export function deleteItemInServer(obj) {
  fetch(`http://localhost:3000/api/todos/${obj.id}`, {
    method: 'DELETE'
  });
}

// изменения состояния дела на сервере
export function changeItemInServer(obj) {
  obj.done = !obj.done;
  fetch(`http://localhost:3000/api/todos/${obj.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      done: obj.done
    }),
  });
}

// функция создания элемента дела и добавление его в разметку со связью с API (сохранение/удаление дела)
export function createToDoItemByAPI(todoList, itemObject) {
  const todoItemElement = createToDoItem(itemObject);
  todoList.append(todoItemElement.item);

  // используем глобальные функции события клика на "удалить дело" и " изменить статус дела" с сохраненем результата клика на сервере
  deleteItem(todoItemElement.deleteButton, todoItemElement.item, itemObject, deleteItemInServer);
  makeItemReady(todoItemElement.doneButton, todoItemElement.item, itemObject, changeItemInServer);
}
