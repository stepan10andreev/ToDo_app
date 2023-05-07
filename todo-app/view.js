import { saveListInLocalStorage, loadListFromLocalStorage, createToDoItemByLocalStorage } from './useLocalStorage.js';
import { loadItems, addItemInServer, createToDoItemByAPI } from "./useAPI.js";
import { switchMode } from './switchMode.js';

// создаем и возвращаем заголовк приложения
export function createAppTitle(title) {
  let appTitle = document.createElement('h2');
  appTitle.innerHTML = title;
  return appTitle;
}

// cоздаем и возвращаем форму (и ее детей) для создания дела
export function createToDoItemform() {
  // создаем элементы страницы и помещаем в переменные
  let form = document.createElement('form');
  let input = document.createElement('input');
  let buttonWrapper = document.createElement('div');
  let button = document.createElement('button');
  // добваляем классы БУТСТРАПА для стилизации
  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  input.placeholder = 'Введите название нового дела';
  buttonWrapper.classList.add('input-group-append');
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Добавить дело';
  button.disabled = true;
  // помещаем элементы друг в друга
  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);
  // активация/дезактивация кнопки
  input.addEventListener('input', function() {
      if (input.value !== '') {
          button.disabled = false;
      } else {
          button.disabled = true;
      }
  });

  return {
      form,
      input,
      button,
  };
}

// cоздаем и возвращаем список элементов
export function createToDoList() {
  let list = document.createElement('ul');
  list.classList.add('list-group');
  return list;
}

// создадим ДОМ-элемент с делом,содержащий имя дела и кнопки
export function createToDoItem(obj) {
  // создаем элемент списка
  let item = document.createElement('li');
  // создаем кнопки и их обертку (блок), в который мы поместим эти кнопки, чтобы показать их в одной группе
  let buttonGroup = document.createElement('div');
  let doneButton = document.createElement('button');
  let deleteButton = document.createElement('button');
  let doneBlock = document.createElement('span');
  // добваляем классы БУТСТРАПА для стилизации элемента списка и для размещения кнопок
  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

  item.textContent = obj.name;

  // cоздания статуса дела в зависимости от статуса обьекта
  if (obj.done) {
    item.classList.add('list-group-item-success');
  } else {
    item.classList.remove('list-group-item-success');
  }

  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.classList.add('btn', 'btn-success');
  doneButton.textContent = 'Готово';
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Удалить';
  doneBlock.classList.add('badge', 'badge-success');;
  // помещаем элементы друг в друга
  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);
  return {
    item,
    doneButton,
    deleteButton,
  };
}

// функция получения ID для обьекта
export function getId(arr) {
  let maxId = 0;
  for (let item of arr) {
      if (item.id > maxId) maxId = item.id
  }
  return maxId + 1;
};

// функция сохранения изменений списка (также доступная глобально)
export function saveList(arroy, listName) {
  localStorage.setItem(listName, JSON.stringify(arroy))
}

// глобальные функции по событию клика на кнопки
// содержат в себе функцию сохранения в localStorage или на сервере в зависимости от - передан ли arr или нет аргументах
export function makeItemReady(button, item, itemObject, fn, arr, listName) {
  button.addEventListener('click', function () {
    item.classList.toggle('list-group-item-success');
    if (arr != undefined) {
      for (let item of arr) {
        if (item.id == itemObject.id) {
          itemObject.done = !itemObject.done;
        }
      }
      fn(arr, listName);
    } else {
      fn(itemObject);
    }
  })
}

export function deleteItem(button, item, itemObject, fn, arr, listName) {
  button.addEventListener('click', function () {
    if (confirm('Вы уверены?')) {
      item.remove();
      if (arr != undefined) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id == itemObject.id) {
            arr.splice(i, 1);
          }
        }
       fn(arr, listName);
      } else {
        fn(itemObject);
      }
    }
  })
}

// функция, создающая приложение
export async function createToDoApp(container, title = 'Список дел', listName, owner) {
  let todoAppTitle = createAppTitle(title);
  let todoItemForm = createToDoItemform();
  let todoList = createToDoList();

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  // задаем переменную, в которую дальше будем записывать массив обьектов из локального хранилища (задаем для глобальной видиомсти в дальнейшем для блоков else, где используется loacalStorage
  let arrItemObjects = [];

  // вызываем функцию переключения режима и записываем ее резуьтат в переменную checkMode - которая определяет режим локального или серверного хранилища
  let checkMode = switchMode();

  // если переменная checkMode - "сервер" то идет загрузка и отрсиовка данных с СЕРВЕРА
  // во всех других случаях = используется LOCALSTORAGE (то есть по умолчанию используем локальное хранилище)
  if (checkMode === 'server') {
    // загрузка данных с сервера (массив)
    let dataItemList = await loadItems(owner);

    // отрисовка дел на основе полученных данных с СЕРВЕРА
    dataItemList.forEach(itemObject => {
      createToDoItemByAPI(todoList, itemObject)
    })
  } else {
    // записываем в ранее введенную переменную массива обьектов дел  -  результат функции получения данных из LocalStorage (массив)
    arrItemObjects = loadListFromLocalStorage(listName);

    // отрисовка на основе данных из LocalStorage
    for (let itemObject of arrItemObjects) {
      createToDoItemByLocalStorage(todoList, itemObject, arrItemObjects, listName)
    }
  }

  // событие submit и результат в зависимости от переменной checkMode
  todoItemForm.form.addEventListener('submit', async function(e) {
    e.preventDefault();
    // игнорируем создание элемента, если пользователь ничего не ввел в поле
    if (!todoItemForm.input.value) {
        return;
    }

    // опять если переменная checkMode - "сервер" - то добавление обьекта дела идет на сервер
    if (checkMode === 'server') {
      // постим на сервер обьект дела
      const itemObject = await addItemInServer(todoItemForm.input.value, owner);

      // отрисовка на основе обьекта поста ДОМ-элемента дела
      createToDoItemByAPI(todoList, itemObject)
    } else {
      // блок else -  LOCALSTORAGE во всех остальных случаях используется локальное хранлилище для записи данных
      // создаем обьект дела
      let itemObject = {
        id: getId(arrItemObjects),
        name: todoItemForm.input.value,
        done: false,
      };

      // добавляем дело в виде обьекта в  ранее введенную переменную массива
      arrItemObjects.push(itemObject);
      // функция сохранения массива  после добавления в него дела
      saveListInLocalStorage(arrItemObjects, listName)
      // отрисовка на основе созданного обьекта в LOCALSTORAGE
      createToDoItemByLocalStorage(todoList, itemObject, arrItemObjects, listName)

    }

    // очищаем поле для ввода
    todoItemForm.input.value = '';
    // дезактивация кнопки после отправки
    todoItemForm.button.disabled = true;
  });
}
